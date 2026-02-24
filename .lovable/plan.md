

## Plan: Admin Panel Sidebar + Add Food Trucks Page

### Summary
Add an admin sidebar navigation panel to the dashboard area, and create a new "Add Food Trucks" page where admins can add trucks manually or via PDF/Excel file upload.

### Architecture

```text
/admin (layout with sidebar)
  ├── /admin          → Dashboard (existing stats + truck list)
  ├── /admin/add      → Add Food Trucks (new page)
  └── (future panels can be added easily)
```

### Changes

#### 1. Create Admin Layout with Sidebar (`src/components/AdminLayout.tsx`)
- A wrapper component using Tabs or a custom sidebar on the right side (RTL)
- Navigation links: "לוח בקרה" (Dashboard), "הוספת פודטראקים" (Add Trucks)
- Icons for each menu item (BarChart3, PlusCircle)
- Responsive: collapsible on mobile

#### 2. Create Add Trucks Page (`src/pages/AdminAddTrucks.tsx`)
- A form to manually add a food truck with fields: truck_name, vehicle_type, food_category, location selection
- A file upload section with a button to upload PDF or Excel files (stored in the `documents` bucket)
- Uses the existing `FileUpload` component pattern but accepts `.pdf,.xlsx,.xls` files
- Inserts into `food_trucks` table with admin as operator (or null operator for admin-created trucks)

#### 3. Refactor AdminDashboard (`src/pages/AdminDashboard.tsx`)
- Extract the dashboard content into its own component
- Wrap it with the new AdminLayout sidebar

#### 4. Update Routes (`src/App.tsx`)
- Add route `/admin/add` pointing to `AdminAddTrucks`
- Keep `/admin` as the main dashboard

### Technical Details

- **Sidebar**: Built with existing shadcn Tabs or a simple flex layout with nav links (no need for the full Sidebar component since we only have 2-3 items)
- **File Upload**: Reuse the `FileUpload` component with `bucket="documents"`, `accept=".pdf,.xlsx,.xls"`, `isImage=false`
- **RLS**: Admins already have full access via `is_privileged()` policy on `food_trucks`, so no database changes needed
- **No schema changes required**: The existing `food_trucks` table supports all fields, and `operator_id` is nullable

