# Portfolio contributor guide

## Purpose and stack

This is Stefan Gogov’s static Astro portfolio. The primary site is a product-delivery workspace; `/bio` is a deliberately separate contact card. Astro owns routes, layouts, and static rendering. React is used only for the GitHub-pinned repository list.

Use pnpm for all package commands. Astro 7 requires Node.js 22.12+ to build; the repository intentionally does not pin a Node version, so ensure the local machine and deployment provider meet that requirement.

## Commands

- `pnpm install` — install dependencies.
- `pnpm dev` — start the local development server.
- `pnpm check` — run `astro check`.
- `pnpm test` — run focused Vitest unit tests.
- `pnpm build` — produce the static site in `dist/`.
- `pnpm verify` — required handoff check: type checks, unit tests, then production build.

Run `pnpm verify` after changes that touch shared UI, data, routes, styles, or build configuration. Use targeted checks while iterating, but do not hand off a broken production build.

## Routes and content sources

| Route | Purpose |
| --- | --- |
| `/` | Workspace overview |
| `/work` | Professional experience |
| `/projects` | Personal projects sourced from pinned GitHub repositories |
| `/connect` | Contact and capability summary |
| `/bio` | Standalone professional contact card without workspace chrome |

`/about` redirects to `/work`; `/contact` redirects to `/connect`. Keep redirects in `astro.config.mjs` and canonical workspace routes in `src/config/site.ts` aligned.

- `src/config/site.ts` is the source of truth for route names, site metadata, shared destinations, workspace navigation, quick links, and repository endpoints. Add or change a repeated URL here, never in a page or component.
- `src/data/portfolio.ts` contains portfolio copy only: profile, experience, capabilities, and delivery areas. Experience links must reference `DestinationKey` values from `site.ts`.
- `src/lib/github-pinned-repos.ts` contains framework-neutral repository validation and primary/fallback loading. Keep `RepoList.tsx` limited to React state and rendering.
- Keep professional facts accurate: Voidweb is the employer, Inverso.bg is the primary product context, and ScaleFocus is a prior student practice. Do not add an “open to work” claim without explicit approval.

## Components and links

- Use `ActionLink` for prominent actions and `TextLink` for inline/workspace links. Preserve the existing solid, outline, and block treatments rather than adding one-off button systems.
- External destinations must have `target="_blank"`, `rel="noopener noreferrer"`, and a useful native `title`. Internal destinations stay in the same tab.
- `WorkspacePageHeader` is for the shared Work, Projects, Connect, and 404 headers. Keep Bio, experience cards, repository cards, and the mobile drawer specialized; do not abstract a component used only once or twice.
- Icons come from `src/components/ui/Icon/IconPaths.ts`. Use `IconName` for typed icon references, and retain the dedicated Astro and React icon renderers.

## Styling and visual behavior

`src/styles/global.scss` only imports the Sass layers:

- `_tokens.scss` — palette, typography, radius, surface, control, shadow, and motion variables.
- `_base.scss` — reset, global defaults, accessibility, and typography.
- `_utilities.scss` — broadly used utilities only.
- `_workspace.scss` — shared workspace shell, cards, layout, and responsive behavior.

Use semantic token values and shared surface/control classes before adding raw color, shadow, radius, or spacing values. Keep page-specific styles colocated when they are genuinely unique.

Astro scopes component styles. When a parent component styles class names rendered by a child Astro component, use deliberately global selectors or move that shared rule into a global Sass partial. Otherwise a child component can silently lose its layout or interaction styles. Verify desktop sidebar, mobile drawer, and contact CTA layout after any shared-component extraction.

Preserve the existing light/dark theme, persisted preference, glossy but restrained controls, visible keyboard focus states, reduced-motion behavior, and no-horizontal-scroll mobile layout. Treat unrequested visual changes as regressions.

## Environment and deployment

- `.env` is ignored and contains local-only values. Configure equivalent values in the deployment provider.
- `PUBLIC_GA_MEASUREMENT_ID` configures Google Analytics. It is intentionally public: Astro exposes `PUBLIC_` values to client code, and a Google measurement ID must appear in generated analytics markup for `gtag.js`; it is not a secret.
- The site builds as static output. Ensure Netlify uses a Node release compatible with Astro 7 before deploying.

## Quality, accessibility, and cleanup

- Preserve the skip link, `aria-current` navigation state, drawer focus handling, Escape/outside-click close behavior, title attributes, and keyboard-visible focus rings.
- Add unit tests for deterministic branches, especially repository response validation and fallback behavior. Avoid snapshot-only tests or a browser/E2E framework unless the task requires it.
- Before deleting modules, content, or assets, search source, configuration, documentation, and build-time references. Do not remove active background assets, favicon files, or the headshot.
- Do not stage, discard, or overwrite unrelated user changes. Keep diffs focused and run `git diff --check` before handoff.
