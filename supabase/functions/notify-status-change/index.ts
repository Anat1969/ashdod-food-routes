import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { truck_id, old_status, new_status } = await req.json();

    if (!truck_id || !new_status) {
      throw new Error("Missing truck_id or new_status");
    }

    // Get truck info
    const { data: truck, error: truckError } = await supabase
      .from("food_trucks")
      .select("truck_name, operator_id")
      .eq("id", truck_id)
      .single();

    if (truckError || !truck) {
      throw new Error("Truck not found");
    }

    if (!truck.operator_id) {
      return new Response(JSON.stringify({ success: true, skipped: "no operator" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get operator email from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(truck.operator_id);

    if (authError || !authUser?.user?.email) {
      throw new Error("Could not find operator email");
    }

    const statusLabels: Record<string, string> = {
      draft: "טיוטה",
      submitted: "הוגש",
      in_review: "בבדיקה",
      approved: "אושר",
      rejected: "נדחה",
      requires_changes: "דורש שינויים",
    };

    const oldLabel = old_status ? statusLabels[old_status] || old_status : "חדש";
    const newLabel = statusLabels[new_status] || new_status;

    const emailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">עדכון סטטוס בקשה — ${truck.truck_name}</h2>
        <p>שלום,</p>
        <p>הסטטוס של הבקשה שלך <strong>"${truck.truck_name}"</strong> עודכן במערכת:</p>
        <table style="border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 16px; background: #f5f5f5; border: 1px solid #ddd;">סטטוס קודם</td>
            <td style="padding: 8px 16px; border: 1px solid #ddd;">${oldLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; background: #f5f5f5; border: 1px solid #ddd;">סטטוס חדש</td>
            <td style="padding: 8px 16px; border: 1px solid #ddd; font-weight: bold;">${newLabel}</td>
          </tr>
        </table>
        <p>ניתן להיכנס למערכת כדי לצפות בפרטים נוספים.</p>
        <p style="color: #888; font-size: 12px;">הודעה זו נשלחה אוטומטית ממערכת ניהול פודטראקים — עיריית אשדוד</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "מערכת פודטראקים <onboarding@resend.dev>",
        to: [authUser.user.email],
        subject: `עדכון סטטוס: ${truck.truck_name} — ${newLabel}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      throw new Error(`Resend API error [${resendRes.status}]: ${JSON.stringify(resendData)}`);
    }

    return new Response(JSON.stringify({ success: true, email_id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending status notification:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
