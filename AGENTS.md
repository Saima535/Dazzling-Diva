# Dazzling Diva Agent Notes

## Architecture Rules

- `Admin` is the central backend and protected admin application.
- `Client` is the public storefront and uses backend-for-frontend routes for authenticated customer flows.
- MongoDB, Cloudinary secrets, JWT secrets, CSRF secrets, and revalidation secrets must remain server-only.
- Store money in integer minor units and render BDT through shared formatting helpers.
- Public storefront content must come from real database records or polished empty states, never hardcoded fake catalog data.

## Commands

- Admin dev: `cd Admin && npm run dev`
- Client dev: `cd Client && npm run dev`
- Admin quality: `cd Admin && npm run test:integration && npm run test:e2e && npm run lint && npm run typecheck && npm test && npm run build`
- Client quality: `cd Client && npm run test:integration && npm run test:e2e && npm run lint && npm run typecheck && npm test && npm run build`

## Protected Secrets

- Preserve existing values in `Admin/.env`.
- Do not print or commit environment secrets.
- `Cloud_Name`, `Cloudinary_API_Key`, and `Cloudinary_API_Secret` must only be used from server code.

## Coding Conventions

- TypeScript strict mode stays enabled.
- Use Zod for environment and request validation.
- Keep domain logic in small modules under `src/modules`.
- Prefer server components for data-heavy storefront pages.
- Use route handlers for versioned API endpoints and client BFF mutations.

## Definition Of Done

- Both apps start locally.
- Production builds pass.
- Integration and repo-local E2E smoke scripts pass.
- No secret values are exposed in code, logs, or docs.
- Admin auth guards protect dashboard pages and API mutations.
- Storefront renders from backend data and handles empty states gracefully.
