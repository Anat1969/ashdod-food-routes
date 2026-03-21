import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type OpinionPayload = {
  is_desired?: boolean | null;
  vehicle_type?: string | null;
  structure_ok?: boolean | null;
  infra_electricity?: boolean | null;
  infra_water?: boolean | null;
  infra_sewage?: boolean | null;
  environment_ok?: boolean | null;
  operator_name?: string | null;
  location_name?: string | null;
  existing_building_approval?: boolean | null;
};

const textOrUndefined = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const createJsonResponse = (body: Record<string, string>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const buildOpinion = ({
  is_desired,
  vehicle_type,
  structure_ok,
  infra_electricity,
  infra_water,
  infra_sewage,
  environment_ok,
  operator_name,
  location_name,
  existing_building_approval,
}: OpinionPayload) => {
  const locationLabel = textOrUndefined(location_name) ?? "ללא שם";
  const standType = textOrUndefined(vehicle_type);
  const operatorName = textOrUndefined(operator_name);

  const prefix = `המיקום ${locationLabel}`;

  if (is_desired !== true) {
    return {
      field_notes: `${prefix} אינו רצוי${standType ? `, סוג עמדה ${standType}` : ""}.`,
      conditions: "**דחייה** המיקום אינו רצוי.",
    };
  }

  if (structure_ok === false) {
    return {
      field_notes: `${prefix} רצוי. המבנה אינו תקין${standType ? `, סוג עמדה ${standType}` : ""}.`,
      conditions: "**דחייה** המבנה אינו תקין.",
    };
  }

  if (structure_ok !== true) {
    return {
      field_notes: `${prefix} רצוי. מצב המבנה לא נבדק${standType ? `, סוג עמדה ${standType}` : ""}.`,
      conditions: "**דחייה** חסרה בדיקת מבנה.",
    };
  }

  if (infra_electricity !== true) {
    return {
      field_notes: `${prefix} רצוי. המבנה תקין. אין חשמל${standType ? `, סוג עמדה ${standType}` : ""}.`,
      conditions: "**דחייה** אין חיבור חשמל.",
    };
  }

  if (infra_water !== true) {
    return {
      field_notes: `${prefix} רצוי. המבנה תקין וקיים חשמל${standType ? `, סוג עמדה ${standType}` : ""}. אין מים.`,
      conditions: "**דחייה** אין חיבור מים.",
    };
  }

  if (infra_sewage !== true) {
    return {
      field_notes: `${prefix} רצוי. המבנה תקין וקיימים חשמל ומים${standType ? `, סוג עמדה ${standType}` : ""}. אין ביוב.`,
      conditions: "**דחייה** אין חיבור ביוב.",
    };
  }

  if (environment_ok === false) {
    return {
      field_notes: `${prefix} רצוי. המבנה תקין וקיימים חשמל, מים וביוב${standType ? `, סוג עמדה ${standType}` : ""}. הסביבה אינה תקינה.`,
      conditions: "**דחייה** הסביבה אינה תקינה.",
    };
  }

  if (environment_ok !== true) {
    return {
      field_notes: `${prefix} רצוי. המבנה תקין וקיימים חשמל, מים וביוב${standType ? `, סוג עמדה ${standType}` : ""}. מצב הסביבה לא נבדק.`,
      conditions: "**דחייה** חסרה בדיקת סביבה.",
    };
  }

  if (existing_building_approval === false) {
    return {
      field_notes: `${prefix} רצוי. המבנה, התשתיות והסביבה תקינים${standType ? `, סוג עמדה ${standType}` : ""}. אין אישור בנייה קיים.`,
      conditions: "**דחייה** חסר אישור בנייה קיים.",
    };
  }

  if (existing_building_approval === null) {
    return {
      field_notes: `${prefix} רצוי. המבנה, התשתיות והסביבה תקינים${standType ? `, סוג עמדה ${standType}` : ""}. אישור בנייה קיים לא נבדק.`,
      conditions: "**דחייה** חסרה בדיקת אישור בנייה.",
    };
  }

  if (!operatorName) {
    return {
      field_notes: `${prefix} רצוי. המבנה, התשתיות והסביבה תקינים${standType ? `, סוג עמדה ${standType}` : ""}. שם מפעיל חסר.`,
      conditions: "**דחייה** חסר שם מפעיל.",
    };
  }

  return {
    field_notes: `${prefix} רצוי. קיימים מבנה תקין, חשמל, מים, ביוב, סביבה תקינה${existing_building_approval === true ? ", אישור בנייה קיים" : ""}${standType ? `, סוג עמדה ${standType}` : ""} ומפעיל ${operatorName}.`,
    conditions: "**אישור** כל התנאים שנבדקו תקינים.",
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: OpinionPayload = await req.json();
    const { field_notes, conditions } = buildOpinion(payload);

    return createJsonResponse({ field_notes, conditions });
  } catch (e) {
    console.error("generate-opinion error:", e);
    return createJsonResponse(
      { error: e instanceof Error ? e.message : "Unknown error" },
      500
    );
  }
});
