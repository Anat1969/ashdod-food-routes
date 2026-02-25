

## Analysis

The network requests reveal the root cause. When uploading zone images, the storage path includes the Hebrew zone name directly:

```
zones/המצודה_1772023103592.jpg  → 400 InvalidKey
zones/נחל לכיש_1772023117745.jpg → 400 InvalidKey
```

Storage keys do not support Hebrew characters or spaces. The error `"Invalid key"` is returned by the storage service.

## Fix

In `src/pages/ZoneCharacterization.tsx`, the `filePath` is built using `zone.name` which contains Hebrew text. The fix is to encode or replace the zone name with an ASCII-safe identifier (e.g., using `encodeURIComponent` or a simple index/hash).

### Change in `ZoneCharacterization.tsx`

Replace the line:
```typescript
const filePath = `zones/${zone.name}_${Date.now()}.${ext}`;
```
With:
```typescript
const safeName = encodeURIComponent(zone.name);
const filePath = `zones/${safeName}_${Date.now()}.${ext}`;
```

This ensures the storage key contains only URL-safe ASCII characters while still being unique per zone.

### Technical Details
- **Root cause**: Supabase Storage rejects keys with non-ASCII characters (Hebrew) and spaces
- **File changed**: `src/pages/ZoneCharacterization.tsx` (single line change)
- **No database changes needed** - the `zone_images` table and RLS policies are already correct

