# AGENTS.md — GTStyle Fine Jewelry Digital Atelier

## 1. Project Purpose & Scope
Build a mobile-first, high-performance digital atelier for GTStyle Fine Jewelry. The platform operates on a Concierge Direct Order model: customers curate pieces, select metals, sizes, and custom engravings, choose a required delivery date, and place orders without entering card credentials. Upon submission, orders display seller bank transfer credentials and provide one-tap links to WhatsApp and telephone channels for confirmation and receipt exchange.

## 2. Technical Stack
- Framework: Next.js 15+ (App Router, React 19 Server Actions, Server Components)
- Database & ORM: PostgreSQL + Prisma ORM
- State Management: Zustand (Cart & Wishlist with persist middleware to localStorage)
- Styling: Tailwind CSS (Custom luxury color tokens, high-contrast typography)
- Typography: Serif (Cormorant Garamond / Playfair Display) and Sans (Plus Jakarta Sans / Inter)
- Animations: Framer Motion (Slide-over drawers, modal overlays, hover zooms)
- Authentication: NextAuth.js (Auth.js v5) with JWT strategy and Role-Based Access Control (CUSTOMER, ADMIN)

## 3. Agent Roles & Collaboration Matrix
- Lead Systems Architect: Enforces folder layout, Prisma schema integrity, atomic transaction boundaries, and Next.js middleware routing.
- Luxury UX/UI Engineer: Implements the editorial palette, macro jewelry zoom interactions, responsive ring sizer modals, and slide-over drawers.
- Atelier Order Specialist: Oversees zero-gateway checkout, integer financial computations, bank details presentation, and prefilled WhatsApp handshakes.
- Security & Quality Guard: Validates anti-tampering measures, IDOR defenses on order lookups, XSS protection on engravings, and admin middleware route protection.

## 4. Operational Non-Negotiables
1. MONETARY PRECISION: All monetary figures (basePriceCents, priceCents, subtotalCents, shippingCents, totalCents) must be computed and stored strictly as integer kobo (100 kobo = ₦1.00). Floating-point arithmetic for currency is strictly prohibited. Division by 100 is permitted solely when rendering formatted strings in the UI (e.g., ₦${(totalCents / 100).toLocaleString()}).
2. SERVER-AUTHORITATIVE PRICING: Never read or trust product prices submitted from the client browser. During order creation, the server action must query active database variant records using incoming variantId values and compute order totals independently.
3. MANDATORY DELIVERY DATE: Every order submission must capture a requiredDeliveryDate. The date picker must disable past dates and today's date, requiring a minimum lead time of at least 24 hours.
4. SELLER BANK DETAILS EXPOSURE: The order success view (/order-success/[orderId]) must render the official bank details configured in config/seller.ts (Bank Name, Account Name, Account Number) with a functional copy-to-clipboard button and explicit instructions to use the Order Number as transfer narration.
5. DIRECT SELLER OUTREACH: The order success view must feature two prominent, functional direct-contact controls: a WhatsApp button generating a pre-filled message with customer name, order number, total amount, and delivery date; and a direct telephone button configured with tel:+2348000000000.
6. IMMUTABLE SNAPSHOTS: OrderItem records must store frozen snapshots of variant details (productNameSnapshot, metalTypeSnapshot, ringSizeSnapshot, skuSnapshot, unitPriceCents, engravingText).
7. ZERO PLACEHOLDER IMAGES: No broken or distorted mockups. All visual assets must use high-resolution macro jewelry photography with explicit aspect ratios and blur hashes.
8. ATELIER ACCESS CONTROL: All routes under /admin/* must require authentication with role === 'ADMIN' enforced at the middleware level. Customer-facing order confirmation screens must enforce authorization by matching active user sessions or requiring a signed URL query hash.
