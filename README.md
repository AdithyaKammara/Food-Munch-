# Food Munch

**A responsive food-ordering experience inspired by Hyderabad's food culture.**

Food Munch is a frontend portfolio project built to demonstrate a polished restaurant ordering flow: explore dishes, customize portions, manage a persistent cart, apply promo codes, and place demo orders—all wrapped in a warm cream-and-gold visual identity.

<p align="center">
  <a href="https://foodmunch-app.vercel.app/"><strong>Live Demo →</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/AdithyaKammara/Food-Munch-">Source Code</a>
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827">
  <img alt="TypeScript 6" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="GSAP 3.15" src="https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock&logoColor=111827">
</p>

## Features

- **Responsive restaurant experience** with a warm cream-and-gold design system and food photography.
- **Dish discovery** with text search, category filters, vegetarian and high-protein filters, favourites, and sorting.
- **Dish customization** for portions, spice levels, and available add-ons.
- **Persistent cart** with quantity controls, item removal, promo codes, rider tips, and an itemized price summary.
- **Checkout experience** with input validation, delivery-slot selection, and demo payment methods.
- **Order history and tracking** using locally stored demo orders and a simulated tracking timeline.
- **Motion design** with GSAP entrance reveals, restrained interactions, and reduced-motion support.
- **Reusable UI components** for navigation, dialogs, menu cards, cart, and order flows.

## Technology stack

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript 6 |
| Build and development | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animation | GSAP 3.15, ScrollTrigger, `@gsap/react` |
| State management | Zustand 5 with browser persistence |
| UI primitives and icons | Radix UI, lucide-react |
| Forms and validation | React Hook Form, Zod |
| Tests | Vitest, Testing Library |

## Run locally

### Prerequisites

- Node.js 22.12 or newer in the Node 22 release line (or another version supported by the installed Vite release)
- npm

### Setup

```bash
git clone https://github.com/AdithyaKammara/Food-Munch-.git
cd Food-Munch-
npm ci
npm run dev
```

Vite prints the local development URL in the terminal, usually `http://localhost:5173`.

## Available commands

```bash
npm run dev        # Start the development server
npm run build      # Type-check and create a production build
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
npm run test       # Run the test suite once
npm run test:watch # Run tests in watch mode
npm run check      # Run lint, tests, and production build
```

Before deploying, run `npm run check` and resolve any reported failures.

## Project structure

```text
src/
├── components/
│   ├── cart/       # Cart drawer and quantity controls
│   ├── checkout/   # Checkout and demo account dialogs
│   ├── home/       # Hero, Why Us, and delivery sections
│   ├── layout/     # Navbar, navigation controls, and footer
│   ├── menu/       # Dish cards, filters, and customization
│   ├── orders/     # Order history and demo tracking
│   └── ui/         # Shared fields and modal primitives
├── data/           # Menu items, portions, and add-ons
├── lib/            # Pricing, order helpers, validation, filters, and motion
├── store/          # Zustand cart, favourites, orders, user, and UI state
├── App.tsx
└── main.tsx
public/
├── images/         # Local dish and decorative photography
├── favicon.svg
└── icons.svg
```

## Demo scope and limitations

Food Munch is a **portfolio/demo application**, not a live restaurant service.

- Cart, profile, and order history data are stored in the browser; they are not synced between devices and are not backed by a server.
- UPI is a demo option only. No money is moved and no payment gateway is connected.
- Order tracking uses a simulated timeline; it does not use live GPS or a delivery-partner API.
- Checkout creates a local demo order; it does not submit a real order to a restaurant.
- Promo codes and pricing rules demonstrate the checkout experience.

Do not enter sensitive personal or payment information into the demo. A production ordering service would need a backend, secure authentication, a real payment integration, and server-side order management.

## Deployment

The live demo is hosted on Vercel: **[foodmunch-app.vercel.app](https://foodmunch-app.vercel.app/)**.

The project uses Vite's standard production build. Recommended Vercel settings:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

## Author

Built as a portfolio project by **Adithya Kammara**.
