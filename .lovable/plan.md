

## Plan: Add Location Card Tab to Truck Profile

### Summary
Add a new "כרטיס מיקום" (Location Card) tab next to the History tab in the truck profile page. This tab will display a comprehensive card matching the structure from the reference image, pulling data from the `locations`, `profiles`, `food_trucks`, and `expert_opinions` tables.

### Reference Image Analysis
The card has these sections (RTL layout):
1. **Photos** — street photos + aerial photo (top section)
2. **מיקום (Location)** — פרטי מיקום (גוש, חלקה), תשתיות (חשמל, מים, ביוב), אופי מיקום (type), שטחים (areas), מיקום רצוי (is_desired)
3. **מצב קיים בשטח (Field Status)** — סביבה (environment ok), מבנה (structure ok), ניתוח מצב קיים (analysis notes)
4. **המפעיל (Operator)** — שם, נייד
5. **הערות (Conditions)** — condition notes (e.g. לא להסתיר נוף טבעי)
6. **מאושר / לא מאושר** — approval status

### Data Mapping

Most data already exists:

| Image Field | Source |
|---|---|
| גוש, חלקה | `locations.gush`, `locations.chelka` |
| חשמל, מים, ביוב | `locations.infra_electricity/water/sewage` |
| אופי מיקום | `locations.location_type` |
| שטח מבנה, שטח סביבה | `locations.building_area_sqm`, `surrounding_area_sqm` |
| מיקום רצוי | `locations.is_desired` |
| תמונות | `food_trucks.street_photo_1/2_url`, `aerial_photo_url` |
| שם, נייד (operator) | `profiles.full_name`, `profiles.phone` |
| מאושר/לא מאושר | `food_trucks.status` |

**Missing fields** — need new columns on `expert_opinions`:
- `environment_ok` (boolean) — מצב סביבה
- `structure_ok` (boolean) — מצב מבנה
- `field_notes` (text) — ניתוח מצב קיים (free text for field analysis)

The existing `conditions` field on `expert_opinions` will store the הערות (condition notes).

### Changes

#### 1. Database Migration
Add 3 columns to `expert_opinions`:
- `environment_ok` boolean nullable
- `structure_ok` boolean nullable  
- `field_notes` text nullable

#### 2. Update `src/pages/TruckProfile.tsx`
- Add a new tab trigger: `<TabsTrigger value="location_card">כרטיס מיקום</TabsTrigger>`
- Fetch location data by joining `food_trucks.location_id → locations`
- Fetch operator profile by `food_trucks.operator_id → profiles`
- Fetch expert opinion by `expert_opinions.truck_id`
- Build the card layout in `<TabsContent value="location_card">` with:
  - Top: photo gallery (street photos + aerial)
  - Right column: location details (גוש, חלקה, תשתיות, אופי, שטחים, מיקום רצוי)
  - Center: field status (סביבה/מבנה checkmarks + analysis notes)
  - Left: operator details + conditions/notes + approval status
- Admins can edit the expert opinion fields (environment_ok, structure_ok, field_notes, conditions)
- Non-admins see read-only view

#### 3. Create `src/components/LocationCard.tsx`
Extract the card into its own component to keep TruckProfile manageable. This component receives:
- `truck: FoodTruck`
- `location: Location | null`
- `operator: Profile | null`
- `expertOpinion: ExpertOpinion | null`
- `isAdmin: boolean`
- `onUpdate: () => void`

The layout will use a light blue background (`bg-sky-50`) matching the reference image, with bordered sections for each data group.

### Technical Details
- The location data fetch uses `supabase.from("locations").select("*").eq("id", truck.location_id).single()` 
- The operator profile fetch uses `supabase.from("profiles").select("*").eq("id", truck.operator_id).single()`
- Expert opinion already has an existing fetch pattern from the `expert_opinions` table
- Admin edits to expert opinion fields use upsert (insert if not exists, update if exists)
- No new RLS policies needed — `expert_opinions` already has privileged access for admins and operator read access

