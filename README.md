# Dazzling Diva

Dazzling Diva is a dual-application fashion ecommerce platform. `Admin` is the protected operations hub and central backend API. `Client` is the public storefront built against that backend and styled to follow the supplied design direction.

## Repository Layout

- `Admin/` Next.js admin application and versioned REST API under `/api/v1`
- `Client/` Next.js storefront, cookie-backed cart, and checkout flow
- `design/` reference exports and mapping notes
- `AGENTS.md` implementation guardrails for future coding agents

## Implemented Modules

- Admin authentication with password hashing and a signed session cookie
- Admin dashboard sections for products, categories, collections, homepage content, orders, shipping, settings, coupons, customers, reviews, administrators, audit logs, and media
- MongoDB-backed models for admin users, catalog, homepage config, shipping methods, orders, customers, wishlists, coupons, reviews, inventory movements, media assets, audit logs, and rate-limit windows
- Public storefront API for home content, categories, collections, products, checkout, coupon validation, order tracking, customer auth, customer profile, customer orders, customer wishlist, and review submission
- Storefront home, shop, category, collection, product, cart, checkout, order success, order tracking, customer account, wishlist, and legal/content pages
- Cookie-backed guest cart with server-side checkout submission
- Customer account registration/login and account-linked order history
- Media upload, replace, search/filter, and delete workflows backed by signed server-side Cloudinary requests
- Transactional checkout orchestration with MongoDB sessions, atomic stock decrements, coupon application inside the transaction, duplicate-request recovery via idempotency keys, and safe failure when MongoDB transactions are unavailable

## Environment

### Admin

Copy `Admin/.env.example` to `Admin/.env` if you are starting fresh. This repository already preserves the existing required keys:

- `MONGO_URI`
- `Cloud_Name`
- `Cloudinary_API_Key`
- `Cloudinary_API_Secret`

Additional local keys used by the current build:

- `AUTH_JWT_SECRET`
- `AUTH_REFRESH_TOKEN_SECRET`
- `CSRF_SECRET`
- `CLIENT_ORIGIN`
- `ADMIN_ORIGIN`
- `CLIENT_INTERNAL_URL`
- `REVALIDATION_SECRET`
- `DEFAULT_TIMEZONE`
- `DEFAULT_CURRENCY`
- `NODE_ENV`

### Client

Copy `Client/.env.example` to `Client/.env.local` if needed.

- `BACKEND_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `REVALIDATION_SECRET`

## Local Run Commands

### Install

```bash
cd Admin && npm install
cd ../Client && npm install
```

### Development

```bash
cd Admin && npm run dev
cd Client && npm run dev
```

Use the storefront on `http://localhost:3000` and the admin app on `http://localhost:3001` if you start them on separate ports.

## Create The First Super Admin

Run the interactive script from the `Admin` app:

```bash
cd Admin
npm run create-admin
```

The script prompts for name, email, and password, then writes the admin user to MongoDB.

## Quality Commands

### Admin

```bash
cd Admin
npm run test:integration
npm run test:e2e
npm run typecheck
npm run lint
npm test
npm run build
```

### Client

```bash
cd Client
npm run test:integration
npm run test:e2e
npm run typecheck
npm run lint
npm test
npm run build
```

## Checkout Robustness

- `Admin/src/modules/orders/service.ts` places orders inside a MongoDB transaction and fails safely with a configuration error if the deployment does not support transactions.
- Variant stock is decremented with an atomic `$elemMatch` update so concurrent requests cannot oversell the same variant.
- Orders now use a database-enforced idempotency key index and duplicate-key recovery so repeated submissions return the existing order instead of creating a second one.
- The storefront checkout action sends a fresh idempotency key for each submission attempt.
- Published product windows are enforced during checkout through the same server-side filter used for catalog visibility.

## Testing Matrix

- `Admin` unit and contract tests cover coupon math, slug normalization, Mongo-backed rate-limit expiry, checkout schema validation, publish-window checkout filtering, duplicate-key detection, and OpenAPI route contract smoke coverage.
- `Client` tests cover money formatting, customer session cookie naming, checkout request contract behavior, backend error propagation, and a repo-local order-placement plus order-tracking API smoke flow.
- `npm run test:integration` exists in both apps for higher-value contract/integration checks.
- `npm run test:e2e` exists in both apps for repo-local API/contract smoke tests.
- Browser-driven E2E automation with Playwright or similar is still not present in this repository.

## Verification Report

Verified on Saturday, July 25, 2026.

### Admin

- `npm run test:integration`: passed
- `npm run test:e2e`: passed
- `npm test`: passed
- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm run build`: passed

### Client

- `npm run test:integration`: passed
- `npm run test:e2e`: passed
- `npm test`: passed
- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm run build`: passed

## Security Notes

- Passwords are hashed with `argon2`.
- Security headers are applied in [Admin/src/proxy.ts](E:/myWebsites/Dazzling-Diva/Admin/src/proxy.ts:1).
- Sensitive checkout and customer routes enforce origin validation and Mongo-backed rate limiting.
- Structured server logging redacts common secret-bearing keys before emission.

## Media Management

- The Admin media console now supports upload, replace, delete, search, and folder filtering.
- Media persistence is tracked in the `MediaAsset` model, including usage-reference metadata.
- Cloudinary requests are signed on the server and never expose the secret to the client.

## Current Limitations

- The checkout path now depends on MongoDB transaction support; production deployments must use a replica set or Atlas cluster.
- The added `test:e2e` scripts are repository-local contract smoke tests, not full browser automation.
- The wider original brief still asked for deeper security and operations coverage than is verified here, including fuller CSRF wiring, deeper RBAC policy coverage, and broader browser-level end-to-end coverage.
