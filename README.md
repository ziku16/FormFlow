# FormFlow — Phase 1

A working Next.js App Router, React, TypeScript, and Tailwind CSS foundation derived from `design.html`.

## Run

Use Node.js 20.9 or newer.

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The root page is the complete design-system gallery. The original reference remains in `design.html`.

```bash
npm run typecheck
npm run lint
npm run check:design
npm run build
npm start
```

## Architecture

- `src/app`: metadata, global stylesheet entry point, and App Router root page.
- `src/styles/tokens.css`: every original CSS custom property, copied without value changes.
- `src/styles/design.css`: all original selectors, declarations, breakpoints, and print/reduced-motion rules.
- `src/styles/foundation.css`: native-dialog and reusable-control support that has no counterpart in the static reference.
- `src/components/ui`: typed buttons, icon buttons, cards, badges, fields, selects, textareas, checkboxes, radios, notices, modal, progress bar, and toast provider.
- `src/components/layout`: application shell, screen navigation, workflow stepper, section navigation, and page headings.
- `src/components/design-system`: the reference typography, colors, spacing, components, navigation, and voice gallery.
- `src/lib`: typed navigation metadata and class-name helper.
- `scripts/check-design.mjs`: compares every source CSS declaration and the font URL to the HTML reference.

Tailwind 3 is intentional: the original uses the Tailwind 3 CDN. Compiled utilities replace the CDN while retaining its preflight behavior. Theme utilities refer to the source CSS variables. Original CSS loads after generated utilities, as it did in the reference. The Google Fonts URL, requested weights, and fallback stacks are unchanged. Fonts require an internet connection, just as the reference does.

## Phase boundary

Phase 1 implements the foundations and shell only. The design-system gallery is active; later screen buttons are disabled and identified by tooltips. There are no empty application routes. The help modal, native fields, checkbox/radio selection, toast notifications, and editable document-card modal work. Modal focus is contained by the native dialog, Escape closes it, focus returns to the opener, and background scrolling is locked while open.

The document-card name is component-demo state held in memory. It is not an application data-persistence implementation. No PDF upload, extraction, AI endpoint, guided application workflow, authentication, or database is implemented in this phase.

## Full source delivery

`PHASE_1_SOURCE.md` contains the complete contents of every Phase 1 configuration, source, and documentation file, including the dependency lockfile. It excludes generated build output, installed dependencies, the unchanged design reference, and the source-delivery document itself. All original source files are also available individually in this repository.

## Verification and dependency notes

Phase 1 passes the production build, strict TypeScript check, ESLint, and the source-style comparison (41 tokens and 902 CSS declarations). Browser checks covered the design gallery, help dialog, Escape dismissal, focus restoration, required document-name feedback, and document-card state updates. No browser console errors or warnings were reported during these checks.

At installation, `npm audit --omit=dev` reported zero production dependency advisories. The complete audit reported nine development-tool advisories (seven high, two moderate), involving the Tailwind 3/ESLint glob and CSS-parser dependency chains. They concern processing crafted glob patterns or selectors in local tooling. Tailwind 3 is retained to preserve the reference preflight; the audit's proposed major-version changes were not applied automatically. Do not expose build tooling to untrusted patterns or selectors. Re-evaluate these dependencies before deployment or a Tailwind migration.

Regenerate the full source document after changes:

```bash
npm run export:source
```
