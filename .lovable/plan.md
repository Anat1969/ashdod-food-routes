

## Tri-State Fix for LocationCard "מצב בשטח" Checkboxes

The previous change was applied to the compliance checklist section in `TruckProfile.tsx`, but the "מצב סביבה תקין" and "מצב מבנה תקין" checkboxes live in `src/components/LocationCard.tsx` — and those still use a binary `!current` toggle.

### Changes

**File: `src/components/LocationCard.tsx`**

1. **`toggleExpertBool` function** (line 154-166): Change from `!current` to tri-state cycle: `null → true → false → null`

2. **`BoolField` component** (line ~458-466): Update the admin checkbox to use the same tri-state visual pattern:
   - `true` → checked (green check)
   - `false` → indeterminate state with destructive/red styling
   - `null` → unchecked (not set)

3. **Read-only view** in `BoolField`: Show `Check` for true, `X` for false, `Minus` for null (already partially done but needs the Minus icon for null)

### Summary
- One file changed: `src/components/LocationCard.tsx`
- Two functions updated: `toggleExpertBool` + `BoolField`
- Same tri-state pattern already used in the compliance checklist

