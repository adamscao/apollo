# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/informational website for Apollo Insurance (阿波罗保险公司 / Assurance Apollo), a sub-brand of AssurPV based in Brossard, Quebec, Canada, serving Chinese-speaking clients. Built with Astro + Tailwind CSS, deployed to Netlify (with a Netlify Function handling the contact form).

## Commands

- `npm run dev` — start local dev server at `localhost:4321`
- `npm run build` — build production site to `./dist/`
- `npm run preview` — preview the production build locally
- `npm run astro ...` — run Astro CLI commands (e.g. `npm run astro check` for type checking)

There is no test suite or linter configured in this project.

## Architecture

### Trilingual routing (no i18n framework)

The site is fully trilingual with no use of Astro's built-in i18n routing — instead, content is duplicated into three parallel directory trees:

- `src/pages/zh/*` — Simplified Chinese (the default/primary language)
- `src/pages/en/*` — English
- `src/pages/fr/*` — French

Each tree has the same seven pages: `index`, `about`, `services`, `team`, `claims`, `faq`, `contact`. `src/pages/index.astro` (the site root) does a client-side redirect to `/zh/`.

**When adding, removing, or restructuring a page, the change must be replicated across all three language directories** to keep them in sync. There's no shared content source — each locale's copy is written directly into its own `.astro` file.

### Layouts

- `src/layouts/BaseLayout.astro` is the real layout used by every page. It takes `title`, `description`, and `lang` (`'zh' | 'en' | 'fr'`) props, and contains inline per-language UI strings (nav labels, footer copy, language-switcher labels) in a `uiText`/translation-object pattern. Header nav links and the language switcher are generated from `lang` and `Astro.url.pathname`, so cross-language links are produced by swapping the `/zh|en|fr` path prefix rather than through routing config.
- `src/layouts/Layout.astro` is the unmodified Astro starter template — not used by any real page. Leave it alone or remove it; don't build new pages on it.

New pages/sections should follow the same pattern as existing ones: add localized strings inline (or in a small object) per page/component rather than introducing a new i18n mechanism, unless asked to.

### Contact form

The contact form (`src/pages/{lang}/contact.astro`) submits via `fetch` to `/.netlify/functions/submit-contact`, handled by `netlify/functions/submit-contact.js`. That function:

- Uses `Resend` (env var `RESEND_API_KEY`) to send two emails per submission: a localized confirmation to the submitter and a notification to `ADMIN_EMAIL` (default `info@apolloins.ca`), from `FROM_EMAIL` (default `noreply@notifications.apolloins.ca`).
- Selects email copy/subject based on the `lang` field in the POST body (`zh`/`en`/`fr`), with English as the fallback.
- All three languages' email templates and subject-line translations live inline in this one file — keep them in sync when editing the confirmation/admin templates or the subject list.

### Styling

Tailwind CSS (via `@astrojs/tailwind`) with a custom brand palette defined in `tailwind.config.mjs`: `primary` (#1F4E79), `secondary` (#FFC000), `accent` (#4472C4), `light` (#F2F2F2), `dark` (#333333). Use these tokens rather than raw hex/arbitrary colors for brand-consistent UI.

### Deployment

`netlify.toml` builds with `npm run build`, publishes `dist/`, and points Netlify Functions at `netlify/functions/`. A catch-all redirect (`/*` → `/index.html`, 200) is in place for client-side routing. `astro.config.mjs` allows dev-server hosts `appolo.smartcubes.uk` and `apolloins.ca`.
