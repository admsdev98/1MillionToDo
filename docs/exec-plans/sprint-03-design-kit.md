# Sprint 03 design kit

Goal: redesign the assessment UI to feel consistent with 1millionbot.com (marketing) and app.1millionbot.com (auth layout), without copying them pixel-for-pixel.

Sources captured on 2026-02-28:
- https://1millionbot.com/
- https://app.1millionbot.com/auth/login

## Design direction
- Clean, white-first surfaces with strong typography and a single red call-to-action.
- Rounded, pill-like CTAs (marketing) and calm, form-friendly layout (auth).
- Minimal motion (one subtle page fade) and clear focus states.

## Typography
Marketing reference (1millionbot.com):
- Body/UI: `Inter, Helvetica, Arial, Lucida, sans-serif`
- Display/CTA: `Lato, Helvetica, Arial, Lucida, sans-serif`

Auth reference (app.1millionbot.com):
- UI: `"Open Sans", sans-serif`

Chosen for Sprint 03:
- Use `Inter` for UI/body and `Lato` for display/CTAs.
- Keep a resilient fallback stack so the UI still looks acceptable if web fonts fail.

Suggested fallbacks:
- UI: `Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
- Display: `Lato, Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`

## Color tokens (hex)
Confirmed from 1millionbot.com computed styles:
- Ink (hero headings): `#04274f`
- Body text: `#333333`
- CTA / accent red: `#ef5350`
- Surface: `#ffffff`

Recommended supporting neutrals:
- Subtle surface: `#f6f7fb`
- Border: `#e6e8f0`
- Muted text: `#667085`

State colors (recommended):
- Success: `#12b76a`
- Warning: `#f79009`
- Danger: `#f04438`

## Radius, shadows, spacing
Confirmed from 1millionbot.com:
- Pill radius: `24px`

Recommended:
- Card radius: `16px`
- Input radius: `12px`
- Shadow (card): `0 18px 50px rgba(0, 0, 0, 0.12)` (reduce if it feels too heavy)

Spacing scale (px): `4, 8, 12, 16, 24, 32, 48, 64`

## Layout rules
Confirmed from 1millionbot.com (desktop sample):
- Header height: ~`88px`
- Max content width: `1072px`

Auth layout inspiration (app.1millionbot.com):
- Two columns on desktop (left message + visual, right form)
- Single column on mobile

Recommended breakpoints:
- Mobile: default
- Desktop: `min-width: 960px`

## Components (minimum set)
- Primary CTA button: red fill, pill radius, `Lato` 16-18px, medium weight.
- Secondary button: white surface with border, pill radius.
- Text link: underline on hover/focus; use ink or accent red.
- Card: white surface, soft border, optional shadow.
- Input: clear border, visible focus ring (avoid relying on color only).
- Badge: `Owned` / `Shared` pill; shared uses accent tint.
- Banner/toast: inline at top of the screen for errors and success.

## Routing decision
Chosen: SPA routing with URL-based navigation using the History API.

Why:
- Keeps one HTML shell (`frontend/public/index.html`) and avoids duplicated templates.
- Matches the existing no-build vanilla setup and works with backend fallback.
- Supports deep links and browser back/forward with `pushState` + `popstate`.

Alternative rejected: multi-page routing with one HTML file per screen.

Why rejected:
- Would duplicate layout/styles and increase backend routing surface.
- Makes frontend consistency and maintenance harder for this assessment scope.

Navigation model:
- Intercept internal anchor clicks (`<a href="/path">`) and call router `navigate`.
- Use `history.pushState` for user-triggered route changes.
- Listen to `window.popstate` to re-render on back/forward.
- Keep hard redirects only for full reload scenarios.

## Routes (confirmed)
The backend serves `frontend/public/index.html` as a catch-all for non-`/v1/*` paths.
Confirmed SPA routes handled client-side:
- `/` landing
- `/auth/login` login
- `/auth/register` register
- `/app` dashboard
- `/error/not-found` not found
- `/error/forbidden` forbidden
- `/error/unexpected` generic error

## Component mapping to tokens
- Button (primary CTA): `--color-cta` background + `--radius-pill` + `--font-display`.
- Button (secondary): `--color-surface` background + `--color-border` + `--radius-pill`.
- Input: `--color-surface` + `--color-border` + `--radius-input` + visible focus ring.
- Card: `--color-surface` + `--radius-card` + soft border/shadow.
- Badge (`owned`/`shared`): pill radius; `shared` uses tinted CTA/ink combination.
- Banner (success/error): inline at top, using state colors with readable contrast.

## Error copy (English, distinct)
- Not found (404 view):
  - Title: "This page does not exist"
  - Body: "The link may be broken, or the page was moved."
  - CTA: "Go to the dashboard" / "Back to home"

- Forbidden (401/403 view):
  - Title: "You do not have access"
  - Body: "Sign in with a different account, or ask the owner for access."
  - CTA: "Go to login" / "Back to dashboard"

- Unexpected (generic view):
  - Title: "Something went wrong"
  - Body: "Try again. If it keeps happening, refresh the page."
  - CTA: "Retry" / "Refresh"

## Motion
- One subtle page fade on route change (150-220ms).
- Optional stagger for task list (keep it subtle and fast).
