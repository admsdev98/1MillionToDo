# Style tokens and UI patterns (EN)

Goal: align the assessment UI with the 1millionbot.com design direction without copying the site.

These tokens are confirmed from 1millionbot.com computed styles (captured 2026-02-28) and should be treated as the baseline for the frontend redesign.

## Tokens (baseline)
- Ink (hero headings): `#04274f`
- Body text: `#333333`
- CTA / accent red: `#ef5350`
- Surface: `#ffffff`
- Border (recommended): `#e6e8f0`
- Muted text (recommended): `#667085`

## Typography
- UI/body: `Inter` (fallback to system UI stack)
- Display/CTAs: `Lato`

## Radius
- Pill radius: `24px`
- Card radius (recommended): `16px`
- Input radius (recommended): `12px`

## Spacing
- Scale (px): `4, 8, 12, 16, 24, 32, 48, 64`

## Patterns
- One primary call-to-action per screen.
- Prefer pill buttons for marketing CTAs; keep forms calm and readable.
- Use cards sparingly (only when they add hierarchy).
- Focus rings must be visible on keyboard navigation.

## Component baseline
- Buttons: primary uses `#ef5350` and `24px` pill radius.
- Inputs: `12px` radius, clear border, strong visible focus.
- Cards: white surface, soft border, optional subtle shadow.
- Badges: `Owned` and `Shared` variants with clear contrast.
- Banner: inline success/error message area above content.
