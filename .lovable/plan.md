

## Plan: Replace "מיקום עמדה" with "שם המפעיל" (Operator Name)

### Summary
Replace the disabled "מיקום עמדה" checkbox column in the directory table with an editable "שם המפעיל" text field. The operator name will be saved to the database and displayed in the station profile card as well.

### Database Change
Add a new `operator_name` column (text, nullable) to the `food_trucks` table. This allows storing a free-text operator name independently from the auth user profile.

```sql
ALTER TABLE public.food_trucks ADD COLUMN operator_name text;
```

### Code Changes

**1. `src/pages/Directory.tsx`**
- Replace the "מיקום עמדה" column header with "שם המפעיל"
- Replace the disabled checkbox with an editable `Input` field
- Add an `updateOperatorName` function that saves the value to `food_trucks.operator_name` on blur
- Include operator name in the search filter

**2. `src/pages/TruckProfile.tsx`**
- Replace the "מיקום עמדה" InfoRow with "שם המפעיל"
- Display the value from `truck.operator_name`
- For admins, make it editable (inline input with save on blur)

### Technical Details
- The input in the directory table will save on blur (when the user clicks away) to avoid excessive database calls
- Local state will track per-row edits before saving
- The `operator_name` field is added to `food_trucks` directly (not to `locations` or `profiles`) since it's a per-station attribute that admins fill in manually

