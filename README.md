# Stefan Gogov — Portfolio

A static Astro portfolio presenting product engineering work across web, mobile, and cloud delivery.

## Routes

- `/` — Overview
- `/work` — Professional experience
- `/projects` — Personal projects sourced from pinned GitHub repositories
- `/connect` — Professional contact details
- `/bio` — Compact standalone contact card

`/about` redirects to `/work` and `/contact` redirects to `/connect`.

## Development

Use Node.js 22.12+ and pnpm.

```bash
pnpm install
pnpm dev
```

Run all required checks before deployment:

```bash
pnpm verify
```

The site is deployed as static output. Netlify must use Node.js 22.12 or newer to build Astro 7 successfully.

## Project structure

- `src/config/site.ts` — site metadata, routes, destinations, navigation, and integration endpoints
- `src/data/portfolio.ts` — profile, experience, and capability content
- `src/components` — Astro workspace components and the React-backed GitHub repository list
- `src/styles` — design tokens, base styles, utilities, and workspace styles
