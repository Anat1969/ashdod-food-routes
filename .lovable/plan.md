

## Analysis

The application **was** successfully recorded in the `applications` table (I can see the record for "ענת" submitted at 09:43). The problem is that the **Directory page** queries the `food_trucks` table, which is empty.

The original specification states: **"On submit → create new truck card with status ממתין לבדיקה"**. Currently, the `ApplicationForm` only inserts into the `applications` table but does **not** create a corresponding `food_trucks` record.

## Plan

### 1. Update `ApplicationForm.tsx` — Create a food truck on submission

After successfully inserting the application, also insert a new record into the `food_trucks` table with:
- `name` = `applicant_name` (or food category as truck name)
- `operator_name` = `applicant_name`  
- `operator_id` = `applicant_id`
- `contact_phone` = `applicant_phone`
- `contact_email` = `applicant_email`
- `vehicle_type` = `vehicle_type`
- `cuisine` = `food_category`
- `operating_hours` = `operating_hours`
- `street_address` = `requested_street`
- `neighborhood` = `requested_neighborhood`
- `status` = `'ממתין_לבדיקה'`

Then link the new truck's `id` back to the application record (update `applications.truck_id`).

### 2. Add RLS policy for public INSERT on `food_trucks`

Currently only admins can insert food trucks. We need a policy allowing anonymous/public users to insert new trucks (since the application form is public):

```sql
CREATE POLICY "Anyone can submit food trucks via application"
ON public.food_trucks FOR INSERT
WITH CHECK (status = 'ממתין_לבדיקה');
```

This restricts public inserts to only trucks with "pending" status.

### 3. Add RLS policy for public UPDATE on `applications` (to link truck_id)

```sql
CREATE POLICY "Anyone can update their application truck_id"
ON public.applications FOR UPDATE
USING (true)
WITH CHECK (true);
```

Or alternatively, handle the entire flow in a single database function to avoid extra policies.

### 4. Fix existing application — Backfill

Create a food truck record for the existing application (ענת) via a migration or manual query so it appears in the directory immediately.

### Summary

The core fix: the application form needs to also create a `food_trucks` record so the truck appears in the directory. Two small RLS policies will be added to permit this from the public form.

