import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      is_desired,
      vehicle_type,
      structure_ok,
      infra_electricity,
      infra_water,
      infra_sewage,
      environment_ok,
      existing_building_approval,
      operator_name,
      location_name,
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a field inspection assistant that generates structured status analysis for food truck permit requests in Israel. You write ONLY in Hebrew. Keep the total response under 60 words. Use no subjective language — facts only, based strictly on field values.

Output format — exactly two parts separated by a blank line:
Part 1 (ניתוח מצב קיים): Open with the requested location and state whether it is desired or not. Describe confirmed positive fields first, then missing/non-compliant fields. Be factual and neutral.
Part 2 (המלצה): Open with **אישור** or **דחייה** in bold, followed by one clear reason referencing the single most critical condition that determined the outcome.

Hierarchy Rule — evaluate fields in this exact order, stop at first failure:
1. Desired Location — if not desired, immediately recommend rejection. Do not evaluate further.
2. Physical Conditions — structure, infrastructure, environment
3. Official Approvals — existing building approval
4. Operator — relevant only if steps 1, 2, and 3 are fully compliant

If any step fails — state that finding only and recommend rejection. Do not continue evaluating subsequent steps.
Never rely on any existing status field. Do not repeat information between the two parts.`;

    const fieldsSummary = `שדות הקלט:
- מיקום רצוי: ${is_desired ? "כן" : "לא"}
- שם מיקום: ${location_name || "לא צוין"}
- סוג עמדה: ${vehicle_type || "לא צוין"}
- מצב מבנה תקין: ${structure_ok === true ? "כן" : structure_ok === false ? "לא" : "לא נבדק"}
- חשמל: ${infra_electricity ? "קיים" : "לא קיים"}
- מים: ${infra_water ? "קיים" : "לא קיים"}
- ביוב: ${infra_sewage ? "קיים" : "לא קיים"}
- מצב סביבה תקין: ${environment_ok === true ? "כן" : environment_ok === false ? "לא" : "לא נבדק"}
- אישור בנייה קיים: ${existing_building_approval === true ? "כן" : existing_building_approval === false ? "לא" : "לא נבדק"}
- שם מפעיל: ${operator_name || "לא צוין"}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: fieldsSummary },
          ],
        }),
      }
    );

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Split into two parts
    const parts = content.split(/\n\s*\n/);
    const field_notes = parts[0]?.trim() || content.trim();
    const conditions = parts.length > 1 ? parts.slice(1).join("\n\n").trim() : "";

    return new Response(
      JSON.stringify({ field_notes, conditions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-opinion error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
