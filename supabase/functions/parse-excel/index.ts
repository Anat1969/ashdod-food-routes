import { createClient } from "npm:@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx@0.18.5/xlsx.mjs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // Use service role for data operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if user is privileged
    const { data: isPriv } = await supabase.rpc("is_privileged", { _user_id: userId });
    if (!isPriv) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { storage_path } = await req.json();
    if (!storage_path) {
      return new Response(JSON.stringify({ error: "storage_path is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download file from private bucket
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(storage_path);

    if (downloadError || !fileData) {
      return new Response(
        JSON.stringify({ error: "Failed to download file", details: downloadError?.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse Excel
    const arrayBuffer = await fileData.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    // Fetch existing locations
    const { data: existingLocations } = await supabase.from("locations").select("id, name");
    const locationMap = new Map<string, string>();
    (existingLocations || []).forEach((loc: any) => locationMap.set(loc.name, loc.id));

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Parse rows - based on the file structure:
    // Col B (index 1): total number
    // Col C (index 2): number within group  
    // Col D (index 3): מתחם (location)
    // Col E (index 4): שם הנקודה (point name)
    // Col F (index 5): תשתית (infrastructure - V means yes)
    // Col G (index 6): קיים/לא קיים
    // Col H (index 7): שם עסק (business name)

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 5) continue;

      const totalNum = row[1];
      const locationName = String(row[3] || "").trim();
      const pointName = String(row[4] || "").trim();
      const hasInfra = String(row[5] || "").trim().toUpperCase() === "V";
      const exists = String(row[6] || "").trim();
      const businessName = String(row[7] || "").trim();

      // Skip non-data rows (headers, section titles, summary rows)
      if (!totalNum || isNaN(Number(totalNum)) || !pointName || !locationName) {
        continue;
      }

      // Use business name if available, otherwise point name
      const truckName = businessName || pointName;

      // Get or create location
      let locationId = locationMap.get(locationName);
      if (!locationId) {
        const { data: newLoc, error: locError } = await supabase
          .from("locations")
          .insert({ name: locationName })
          .select("id")
          .single();

        if (locError || !newLoc) {
          errors.push(`Row ${i + 1}: failed to create location "${locationName}"`);
          skipped++;
          continue;
        }
        locationId = newLoc.id;
        locationMap.set(locationName, locationId);
      }

      // Insert food truck
      const { error: insertError } = await supabase.from("food_trucks").insert({
        truck_name: truckName,
        location_id: locationId,
        status: "draft",
      });

      if (insertError) {
        errors.push(`Row ${i + 1}: failed to insert "${truckName}" - ${insertError.message}`);
        skipped++;
      } else {
        imported++;
      }
    }

    return new Response(
      JSON.stringify({ imported, skipped, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
