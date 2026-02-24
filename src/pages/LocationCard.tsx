import { useState } from "react";

const initialCard = {
  locationName: "גן אלישבע",
  locationType: "פארק",
  gush: "",
  chelka: "",
  operatorName: "",
  operatorPhone: "",
  locationCharacter: "",
  infra: { electricity: false, water: false, sewage: false },
  buildingArea: "",
  surroundingArea: "",
  fieldConditionBuilding: "",
  fieldConditionSurrounding: "",
  fieldNoteBuilding: "",
  fieldNoteSurrounding: "",
  desiredLocation: false,
  notes: ["", "", "", ""],
  decision: null as string | null,
  photos: { street1: null as File | null, street2: null as File | null, aerial: null as File | null },
};

const locationTypes = [
  { id: "historic", label: "א. חוף אקספנסיבי ומצודה – היסטורי" },
  { id: "tourism", label: "ב. טיילת מרינה – תיירותי" },
  { id: "commercial", label: "ג. חוף אינטנסיבי – מסחרי" },
  { id: "nature", label: "ד. נחל – טבעי" },
  { id: "park", label: "ה. פארק – נופש וביילוי" },
];

function PhotoSlot({ label, value, onChange }: { label: string; value: File | null; onChange: (f: File | null) => void }) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: value ? "transparent" : "rgba(255,255,255,0.07)",
        border: "1.5px dashed rgba(255,255,255,0.25)",
        borderRadius: 6,
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        minHeight: 90,
      }}
    >
      {value ? (
        <img
          src={URL.createObjectURL(value)}
          alt={label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 11, padding: 8 }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>+</div>
          {label}
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  );
}

function CheckToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 4 }}
      onClick={() => onChange(!checked)}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          border: "1.5px solid rgba(255,255,255,0.3)",
          background: checked ? "#2DD4BF" : "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          color: "#1a2a2a",
          fontWeight: 700,
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        {checked ? "✓" : "✗"}
      </div>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{label}</span>
    </div>
  );
}

function FieldInput({ label, value, onChange, type = "text", placeholder = "" }: { label?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {label && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 3, fontWeight: 600 }}>
          {label}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 5,
          padding: "6px 9px",
          color: "#fff",
          fontSize: 12,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
          direction: "rtl",
        }}
      />
    </div>
  );
}

export default function LocationCard() {
  const [card, setCard] = useState(initialCard);
  const [saved, setSaved] = useState(false);

  const update = (field: string, value: any) =>
    setCard((prev) => ({ ...prev, [field]: value }));

  const updateInfra = (key: string) =>
    setCard((prev) => ({
      ...prev,
      infra: { ...prev.infra, [key]: !prev.infra[key as keyof typeof prev.infra] },
    }));

  const updateNote = (i: number, val: string) => {
    const notes = [...card.notes];
    notes[i] = val;
    update("notes", notes);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const completionFields = [
    card.locationCharacter,
    card.operatorName,
    card.operatorPhone,
    card.fieldConditionBuilding,
    card.fieldConditionSurrounding,
  ];
  const filled = completionFields.filter(Boolean).length;
  const total = completionFields.length;

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Heebo', 'Assistant', sans-serif",
        background: "linear-gradient(135deg, #0f2027 0%, #1a3a4a 50%, #0d2b38 100%)",
        minHeight: "100vh",
        padding: "24px 20px",
        color: "#fff",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          paddingBottom: 14,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              background: "rgba(45,212,191,0.15)",
              border: "1px solid rgba(45,212,191,0.4)",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 11,
              color: "#2DD4BF",
              fontWeight: 700,
            }}
          >
            עיריית אשדוד
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            מערכת ניהול פודטראקס
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "3px 10px",
            }}
          >
            {filled}/{total} שדות מולאו
          </div>
          <div
            style={{
              width: 70,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(filled / total) * 100}%`,
                height: "100%",
                background: "#2DD4BF",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Location Name + Type */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>מיקום:</span>
        <input
          value={card.locationName}
          onChange={(e) => update("locationName", e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: "1.5px solid rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            outline: "none",
            direction: "rtl",
            fontFamily: "inherit",
            width: 220,
          }}
        />
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          {card.locationCharacter || "אופי המיקום לא נבחר"}
        </span>
      </div>

      {/* Photo Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 280px",
          gap: 8,
          marginBottom: 20,
          height: 200,
        }}
      >
        <PhotoSlot
          label="תצלום רחוב 1"
          value={card.photos.street1}
          onChange={(f) => update("photos", { ...card.photos, street1: f })}
        />
        <PhotoSlot
          label="תצלום רחוב 2"
          value={card.photos.street2}
          onChange={(f) => update("photos", { ...card.photos, street2: f })}
        />
        <div style={{ position: "relative" }}>
          <PhotoSlot
            label="תצלום אווירי + מיקום"
            value={card.photos.aerial}
            onChange={(f) => update("photos", { ...card.photos, aerial: f })}
          />
          {!card.photos.aerial && (
            <div
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              ← כאן יופיע החץ
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 200px", gap: 14 }}>
        
        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          
          {/* פרטי מיקום */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 8 }}>
              פרטי מיקום
            </div>
            <FieldInput
              label="גוש"
              value={card.gush}
              onChange={(v) => update("gush", v)}
              type="number"
            />
            <FieldInput
              label="חלקה"
              value={card.chelka}
              onChange={(v) => update("chelka", v)}
              type="number"
            />
          </div>

          {/* אופי מיקום */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 8 }}>
              אופי מיקום
            </div>
            {locationTypes.map((lt) => (
              <div
                key={lt.id}
                onClick={() => update("locationCharacter", lt.label)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 7,
                  cursor: "pointer",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    background:
                      card.locationCharacter === lt.label
                        ? "#2DD4BF"
                        : "transparent",
                    flexShrink: 0,
                    marginTop: 2,
                    transition: "background 0.15s",
                  }}
                />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                  {lt.label}
                </span>
              </div>
            ))}
          </div>

          {/* תשתיות */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 8 }}>
              תשתיות
            </div>
            <CheckToggle
              checked={card.infra.electricity}
              onChange={() => updateInfra("electricity")}
              label="חשמל"
            />
            <CheckToggle
              checked={card.infra.water}
              onChange={() => updateInfra("water")}
              label="מים"
            />
            <CheckToggle
              checked={card.infra.sewage}
              onChange={() => updateInfra("sewage")}
              label="ביוב"
            />
          </div>

          {/* שטחים */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 8 }}>
              שטחים
            </div>
            <FieldInput
              label="גודל מבנה (מ״ר)"
              value={card.buildingArea}
              onChange={(v) => update("buildingArea", v)}
              type="number"
            />
            <FieldInput
              label="גודל סביבה (מ״ר)"
              value={card.surroundingArea}
              onChange={(v) => update("surroundingArea", v)}
              type="number"
            />
            <CheckToggle
              checked={card.desiredLocation}
              onChange={(v) => update("desiredLocation", v)}
              label="מיקום רצוי"
            />
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* מצב קיים בשטח */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 10 }}>
              מצב קיים בשטח
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <FieldInput
                label="סביבה"
                value={card.fieldConditionSurrounding}
                onChange={(v) => update("fieldConditionSurrounding", v)}
                placeholder="תאור המצב הקיים..."
              />
              <FieldInput
                label="מבנה"
                value={card.fieldConditionBuilding}
                onChange={(v) => update("fieldConditionBuilding", v)}
                placeholder="תאור המבנה..."
              />
            </div>
          </div>

          {/* ניתוחי מצב קיים */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 14, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 10 }}>
              ניתוחי מצב קיים
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>מבנה</div>
                <textarea
                  value={card.fieldNoteBuilding}
                  onChange={(e) => update("fieldNoteBuilding", e.target.value)}
                  placeholder="• יש לטפל ב..."
                  rows={4}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 5,
                    padding: "7px 9px",
                    color: "#fff",
                    fontSize: 12,
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box" as const,
                    fontFamily: "inherit",
                    direction: "rtl" as const,
                    lineHeight: 1.6,
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>סביבה</div>
                <textarea
                  value={card.fieldNoteSurrounding}
                  onChange={(e) => update("fieldNoteSurrounding", e.target.value)}
                  placeholder="• יש לטפח מצב קיים..."
                  rows={4}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 5,
                    padding: "7px 9px",
                    color: "#fff",
                    fontSize: 12,
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box" as const,
                    fontFamily: "inherit",
                    direction: "rtl" as const,
                    lineHeight: 1.6,
                  }}
                />
              </div>
            </div>
          </div>

          {/* הערות */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 10 }}>
              הערות
            </div>
            {card.notes.map((note, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>•</span>
                <input
                  value={note}
                  onChange={(e) => updateNote(i, e.target.value)}
                  placeholder={`הערה ${i + 1}...`}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "5px 8px",
                    color: "#fff",
                    fontSize: 12,
                    outline: "none",
                    direction: "rtl",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* המפעיל */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 8 }}>
              המפעיל
            </div>
            <FieldInput
              label="שם"
              value={card.operatorName}
              onChange={(v) => update("operatorName", v)}
              placeholder="שם מלא"
            />
            <FieldInput
              label="נייד"
              value={card.operatorPhone}
              onChange={(v) => update("operatorPhone", v)}
              type="tel"
              placeholder="05X-XXXXXXX"
            />
          </div>

          {/* פרטים */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 8 }}>
              פרטים
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>שם</div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 4,
                padding: "6px 9px",
                fontSize: 12,
                color: card.locationName ? "#fff" : "rgba(255,255,255,0.2)",
                marginBottom: 8,
                minHeight: 28,
              }}
            >
              {card.locationName || "—"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>נייד</div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 4,
                padding: "6px 9px",
                fontSize: 12,
                color: card.operatorPhone ? "#fff" : "rgba(255,255,255,0.2)",
                minHeight: 28,
              }}
            >
              {card.operatorPhone || "—"}
            </div>
          </div>

          {/* החלטה */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 12, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 12 }}>
              החלטה
            </div>
            <div
              onClick={() => update("decision", card.decision === "approved" ? null : "approved")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                padding: "10px 12px",
                borderRadius: 7,
                marginBottom: 8,
                background:
                  card.decision === "approved"
                    ? "rgba(45,212,191,0.2)"
                    : "rgba(255,255,255,0.04)",
                border:
                  card.decision === "approved"
                    ? "1.5px solid rgba(45,212,191,0.5)"
                    : "1.5px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 5,
                  background:
                    card.decision === "approved" ? "#2DD4BF" : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1a2a2a",
                }}
              >
                ✓
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>מאושר</span>
            </div>
            <div
              onClick={() => update("decision", card.decision === "rejected" ? null : "rejected")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                padding: "10px 12px",
                borderRadius: 7,
                background:
                  card.decision === "rejected"
                    ? "rgba(239,68,68,0.2)"
                    : "rgba(255,255,255,0.04)",
                border:
                  card.decision === "rejected"
                    ? "1.5px solid rgba(239,68,68,0.5)"
                    : "1.5px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 5,
                  background:
                    card.decision === "rejected" ? "#EF4444" : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                ✗
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>לא מאושר</span>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            style={{
              background: saved
                ? "rgba(45,212,191,0.3)"
                : "linear-gradient(135deg, #2DD4BF, #0891B2)",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              color: saved ? "#2DD4BF" : "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
              fontFamily: "inherit",
              transition: "all 0.2s",
              letterSpacing: 0.5,
            }}
          >
            {saved ? "✓ נשמר בהצלחה" : "שמור כרטיסייה"}
          </button>
        </div>
      </div>
    </div>
  );
}
