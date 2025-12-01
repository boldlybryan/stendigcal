# Stendig Calendar TODO

## Two-Digit Kerning

The font (Neue Haas Grotesk) doesn't include kerning pairs for numbers — this is common because numbers are typically used in tabular contexts where uniform spacing is desired.

### Scope

Only 22 two-digit values exist on a calendar (10-31). Single digits (1-9) need no kerning.

### Problem Pairs

Pairs with `1` and `7` typically need the most adjustment:

| Pair | Issue |
|------|-------|
| 11 | Two narrow characters — needs significant tightening |
| 17, 71 | 1 and 7 both have open right/left sides |
| 14, 41 | 1 next to diagonal |
| 10, 12, 13, 15, 16, 18, 19 | 1 as first digit creates extra space |
| 21, 31 | 1 as second digit |
| 27 | 7's open left + 2's curve |

### Implementation Approach

```javascript
const dayKern = {
  10: -0.03,
  11: -0.08,
  12: -0.04,
  13: -0.03,
  14: -0.04,
  15: -0.03,
  16: -0.03,
  17: -0.06,
  18: -0.03,
  19: -0.03,
  21: -0.04,
  31: -0.04,
  27: -0.02,
  // 20, 22-26, 28-30 likely fine at 0
};

// Apply via inline style:
<div style={{ letterSpacing: dayKern[d] ? `${dayKern[d]}em` : undefined }}>{d}</div>
```

### Notes

- Values are in `em` so they scale with font-size
- Tune values by eye at actual rendered size
- May need adjustment if font-weight changes significantly


---

## Sizing Constraints

### The Core Problem

We want text to fill grid cells, but CSS Grid cells are sized by their content. This creates a circular dependency:

1. Cell size → determined by content (text)
2. Text size → we want it determined by cell size
3. Result → text drives everything, cells can't constrain it

### What We've Tried

| Approach | Result |
|----------|--------|
| `vw`/`vh` units | Works but doesn't account for actual grid dimensions |
| `clamp()` with caps | Stops scaling at cap, doesn't fill space |
| Container queries (`cqh`) | Requires explicit grid height + `min-height: 0` hacks |
| `1fr` rows | Cells expand to fit content unless `min-height: 0` is set |

### The Solution Pattern

Invert the relationship — grid height drives text size:

1. **Fix the grid height explicitly**
   ```css
   .day-grid {
     height: calc(100vh - var(--header-height));
   }
   ```

2. **Calculate row height**
   - 7 rows total (1 weekday header + 6 week rows)
   - Row height = grid height / 7

3. **Derive font-size from row height**
   ```css
   --row-height: calc((100vh - var(--header-height)) / 7);
   --day-size: calc(var(--row-height) * 0.75);
   ```

4. **Or use container queries properly**
   - Set explicit height on grid container
   - Use `container-type: size`
   - Size text with `cqh` units

### Additional Constraints

- **Minimum viewport**: 768px (iPad portrait)
- **No maximum**: Should scale to large displays
- **Aspect ratio**: Calendar is roughly square — wide viewports shouldn't stretch it horizontally
- **Header vs grid**: Header should be compact, grid should dominate
- **Weekday row**: Should be smaller than day numbers (maybe 40% of day size)

### Current State

Using viewport-based sizing that works reasonably but doesn't truly fill cells:

```css
--day-size: max(3rem, min(12vw, 14vh));
--header-size: max(1.5rem, 5vw);
```

This is a fallback — proper solution requires fixing grid dimensions first, then deriving text size.

