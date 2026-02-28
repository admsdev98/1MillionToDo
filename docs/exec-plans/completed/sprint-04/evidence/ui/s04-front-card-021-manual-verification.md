# FRONT-CARD-021 manual verification

Date: 2026-02-28

## Checks performed
- Opened landing and verified header actions only include Login/Register (+ language toggle).
- Verified pricing section renders three plan cards with feature bullets.
- Opened register view and confirmed password confirmation mismatch shows a validation banner.
- Verified register flow includes plan selector and sends selected `plan` in request payload.
- Toggled language EN/ES and reloaded page to confirm persistence.

## Key files changed
- `frontend/public/shared/i18n.js`
- `frontend/public/views/landing-view.js`
- `frontend/public/views/auth-view.js`
- `frontend/public/app.css`
