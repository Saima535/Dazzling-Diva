# Dazzling Diva

Dazzling Diva is a dual-application fashion ecommerce platform. `Admin` is the protected operations hub and central backend API. `Client` is the public storefront built against that backend and styled to follow the supplied design direction.

## Repository Layout

- `Admin/` Next.js admin application and versioned REST API under `/api/v1`
- `Client/` Next.js storefront, cookie-backed cart, and checkout flow
- `design/` reference exports and mapping notes
- `AGENTS.md` implementation guardrails for future coding agents

## Implemented Modules

- Admin authentication with password hashing and a signed session cookie
- Admin dashboard sections for products, categories, collections, homepage content, orders, shipping, and settings
- MongoDB-backed models for admin users, catalog, homepage config, shipping methods, and orders
- Public storefront API for home content, categories, collections, products, checkout, and order tracking
- Storefront home, shop, category, collection, product, cart, checkout, order success, order tracking, and legal/content pages
- Cookie-backed guest cart with server-side checkout submission

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
npm run typecheck
npm run lint
npm test
npm run build
```

### Client

```bash
cd Client
npm run typecheck
npm run lint
npm test
npm run build
```

## Current Limitations

- Cloudinary upload flows are not wired into the dashboard yet; image fields currently accept hosted URLs.
- Customer account authentication, wishlist persistence, and account-linked order history are still placeholder routes.
- Inventory protection is implemented in a simple per-order update flow and does not yet use MongoDB transactions or idempotency keys.
- Advanced admin CRUD such as edit, archive, publish scheduling, reviews, coupons, audit logs, and media management are not complete in this initial build.
