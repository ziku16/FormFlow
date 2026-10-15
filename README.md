# FormFlow — Phases 1, 2, and 3

A complete Next.js App Router, React, TypeScript, and Tailwind CSS application derived from `design.html`.

## Run

Use Node.js 22.18 or newer. The validation and PDF tests use Node’s built-in TypeScript stripping and test runner; no extra test dependencies are required.

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:3000.

| Route            | Implemented screen                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `/`              | Upload entry, file picker, drag-and-drop, local validation, interactive PDF analysis trigger        |
| `/analysis`      | Form onboarding analysis, metadata breakdown, preview zoom, and "Let's fill it in" flow starter      |
| `/fill`          | Guided step-by-step form filling, live PDF preview highlighting, section tabs, real-time validation |
| `/review`        | Form review grouped by section, edit jump navigation, completion badge, PDF preparation check        |
| `/download`      | Completed PDF export, live file generation, download trigger, status alerts, and reset flow          |
| `/states`        | Dedicated gallery of all 7 product error, loading, and validation feedback states                    |
| `/design-system` | Complete design-system and reusable-component gallery                                                |

The original visual reference remains unchanged in `design.html`. Browser back/forward, direct route visits, and top tab navigation across all screens work smoothly.

## Checks and production build

```bash
npm test
npm run typecheck
npm run lint
npm run check:design
npm run build
npm start
```

The automated test suite in `tests/` covers:
- Exactly-one-file intake selection, empty files, size limits (10 MB boundary), extensions, misleading MIME metadata, invalid signatures, read failures, and error recovery.
- Real-time field validation for text fields, email regex, phone formatting, date cutoff (pre-15 Oct 2026), and required declarations.
- Standard PDF 1.4 stream generation matching the design export specification.
- Real AcroForm field detection and extraction from fillable PDFs, and graceful rejection of flat/scanned PDFs.

The stylesheet check (`check:design`) strictly verifies that all 41 original custom property tokens, 902 CSS declarations, media queries, priorities, and Google Fonts URLs match `design.html`.

## Architecture

- `src/app`: routes (`/`, `/analysis`, `/fill`, `/review`, `/download`, `/states`, `/design-system`), shared layout, providers, and error recovery.
- `src/features/pdf`: client-side PDF engine with AcroForm parsing, interactive field extraction, authentic AcroForm filling, and standard PDF stream generation.
- `src/features/form`: central form state management, localStorage persistence, field-level validation rules, and PDF download generation.
- `src/features/intake`: typed file intake validation results, drag-and-drop tracking, and session-local selection state.
- `src/components/form`: guided form screen (`/fill`), review screen (`/review`), download screen (`/download`), and states gallery (`/states`).
- `src/components/onboarding`: upload entry, reusable upload card, and sample analysis screen.
- `src/components/pdf`: interactive document preview with live filled values, field focus highlighting, and 100%/115% zoom.
- `src/components/layout`: shared application shell, screen navigation, workflow stepper, section navigation, and page headings.
- `src/components/ui`: typed buttons, icon buttons, cards, badges, fields, selects, textareas, checkboxes, radios, notices, modal, progress bar, and toast provider.
- `src/data/sample-form.ts`: prepared Northbridge University application schema with 12 fields across 3 sections.
- `src/lib`: typed route navigation items, class-name helper, and shared constants.
- `tests/`: executable unit regression tests (`intake.test.mjs` and `form.test.mjs`).
- `scripts`: visual-token regression check (`check-design.mjs`) and full-source exporter (`export-source.mjs`).

## Persistence & State Management

Form progress, answers, active document mode (`sample` vs `uploaded`), and section state are automatically synchronized to `localStorage`. User inputs survive page refreshes, tab reloads, and screen transitions. A "Try another form" action clears answers and returns to the initial entry point.

## Full source delivery

`PHASE_3_SOURCE.md` contains the complete contents of every source, configuration, test, and documentation file.

`PHASE_1_SOURCE.md` and `PHASE_2_SOURCE.md` are retained as historical milestone snapshots.

Regenerate the full source document:
```bash
npm run export:source
```
