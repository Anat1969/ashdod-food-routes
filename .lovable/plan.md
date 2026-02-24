

## Plan: Auto-Import Food Trucks from Excel Files

### Summary
When an admin uploads an Excel file, automatically parse it server-side using a backend function, extract the food truck data, and insert each row as a record in the `food_trucks` table (and optionally create locations if needed).

### Architecture

```text
Admin uploads .xlsx
  → File stored in "documents" bucket
  → Frontend calls Edge Function "parse-excel" with file URL
  → Edge Function downloads file, parses with SheetJS
  → Matches/creates locations, inserts food_trucks rows
  → Returns summary to frontend (count of imported trucks)
```

### Changes

#### 1. Create Edge Function `supabase/functions/parse-excel/index.ts`
- Receives `{ file_url }` in POST body
- Downloads the file from storage using service role key
- Parses Excel using SheetJS (`https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs`)
- Reads the first sheet, iterates rows
- For each row: extracts truck name, location name, food category, vehicle type (mapping Hebrew column headers)
- Matches location name against existing `locations` table; creates new location if not found
- Inserts each truck into `food_trucks` with status `draft`
- Returns JSON with count of imported trucks and any errors

#### 2. Update `src/pages/AdminAddTrucks.tsx`
- After file upload completes, show an "ייבא נתונים" (Import Data) button
- Clicking it calls the edge function with the uploaded file URL
- Shows a loading spinner during import
- Displays a toast with the number of trucks imported
- Clears the file upload state on success

#### 3. Update `src/components/FileUpload.tsx`
- No changes needed — the existing component already handles upload and returns the URL

### Technical Details

- **SheetJS in Deno**: Import via `https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs` with type declarations
- **Auth**: Edge function uses service role key to bypass RLS for bulk inserts
- **Column mapping**: The function will read the first row as headers and map Hebrew column names to database fields (שם → truck_name, מתחם/מיקום → location name, קטגוריה → food_category, סוג → vehicle_type)
- **Private bucket**: Since `documents` is private, the edge function will use `supabase.storage.from('documents').download(path)` with service role access
- **Error handling**: Rows with missing truck_name are skipped; a summary of skipped rows is returned

