

## Plan: Shorten Columns א and ב to End at the Same Level as "תמונה אווירית"

### Understanding
The user wants columns א (הנחיות למבנה) and ב (הנחיות לסביבה והעמדה) to be shorter vertically - their bottom edge should align with the bottom of the "תמונה אווירית" (aerial photo) field in the documents column. Currently these columns stretch much longer due to their checklist content.

The image shows two empty tall columns that need to be shortened upward.

### Approach
The documents column has 6 upload fields. The aerial photo is the 3rd item. The two checklist columns currently contain many items that make them tall. To align bottoms, we need to constrain the height of columns א and ב so they don't exceed the documents column height, using `max-height` with overflow scroll, or by restructuring the grid.

A practical approach: make columns א and ב scrollable with a constrained max-height, or use `self-start` on the cards so they don't stretch, combined with a max-height. Since the user wants them to end at the aerial photo line, the simplest approach is to add `overflow-y-auto` and a `max-height` to the card content of both columns so they match the documents column height approximately.

Actually, re-reading: the user wants to **shorten** the columns upward - meaning reduce the content height. But the columns have fixed checklist items. The most practical interpretation is to make both checklist cards use scrollable overflow so they don't extend beyond the documents column.

### Changes in `src/pages/TruckProfile.tsx`

1. **Add `self-start` and `max-h-fit`** to columns א and ב cards, and add `overflow-y-auto` to their `CardContent` with a constrained max-height that roughly matches the documents column up to the aerial photo field.

2. Alternatively, use CSS `grid` row alignment: wrap the 3 columns in a grid where columns א and ב align to the top and don't stretch beyond the documents column.

The simplest clean approach: add `overflow-y-auto max-h-[500px]` to the `CardContent` of both checklist cards (lines 206 and 235), so they become scrollable and don't exceed the documents column height.

### Technical Details

**File: `src/pages/TruckProfile.tsx`**

- Line 201 (Card for column א): Add `self-start` class so it doesn't stretch in the grid
- Line 206: Change `<CardContent className="space-y-3">` to `<CardContent className="space-y-3 overflow-y-auto max-h-[400px]">`
- Line 230 (Card for column ב): Add `self-start` class
- Line 235: Change `<CardContent className="space-y-3">` to `<CardContent className="space-y-3 overflow-y-auto max-h-[400px]">`

This will make both columns scrollable and shorter, ending approximately at the same level as the aerial photo in the documents column.

