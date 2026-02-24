

## Plan: Add Drag-and-Drop and Paste Support to FileUpload

### Summary
Enhance the `FileUpload` component so users can drag files onto the upload area or paste images/videos from clipboard, in addition to the existing button upload.

### Changes

#### `src/components/FileUpload.tsx`

1. **Extract upload logic** — Pull the core upload-to-storage logic out of `handleUpload` into a shared `uploadFile(file: File)` function, so it can be reused by drag/drop and paste handlers.

2. **Add drag-and-drop zone** — Wrap the component content in a drop zone `div` with:
   - `onDragOver` / `onDragEnter` — prevent default, set a `dragging` state to `true` for visual feedback
   - `onDragLeave` — set `dragging` back to `false`
   - `onDrop` — extract `e.dataTransfer.files[0]`, call `uploadFile(file)`
   - Visual indicator: dashed border + highlight color when `dragging` is true

3. **Add paste support** — Add an `onPaste` handler on the drop zone:
   - Extract image/video from `e.clipboardData.files` or `e.clipboardData.items`
   - Call `uploadFile(file)` with the pasted file
   - Make the container `tabIndex={0}` so it can receive focus and paste events

4. **Update the empty state** — When no file is uploaded, show the drop zone as a larger target area with text like "גרור תמונה לכאן או הדבק" (Drag image here or paste) alongside the existing upload button.

5. **Accept filter** — Validate dropped/pasted files against the `accept` prop before uploading. Show a toast error if the file type doesn't match.

### Technical Details
- The `uploadFile` function contains the existing logic: generate filename, upload to storage bucket, get public URL, call `onUploaded`
- Drag state is managed with a `useState<boolean>` for the visual border highlight
- Paste handler checks `clipboardData.items` for `kind === 'file'` entries
- No new dependencies needed — all native browser APIs

