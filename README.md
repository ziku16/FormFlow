# FormFlow — Phases 1 and 2

A working Next.js App Router, React, TypeScript, and Tailwind CSS application derived from `design.html`.

## Run

Use Node.js 22.18 or newer. The validation tests use Node’s built-in TypeScript stripping and test runner; no extra test dependencies are required.

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:3000.

| Route            | Implemented screen                                                                 |
| ---------------- | ---------------------------------------------------------------------------------- |
| `/`              | Upload entry, file picker, drag-and-drop, local validation, selected-file feedback |
| `/analysis`      | Prepared university sample analysis and illustrated document preview               |
| `/design-system` | Complete design-system and reusable-component gallery                              |

The original visual reference remains unchanged in `design.html`. Browser back/forward and direct route visits work. The logo returns to the upload page.

## Checks and production build

```bash
npm test
npm run typecheck
npm run lint
npm run check:design
npm run build
npm start
```

The tests cover exactly-one-file selection, empty files, the size limit and its boundary, extension checks, misleading MIME metadata, invalid signatures, read failures, error recovery, and file-size formatting. The stylesheet check compares every source selector, declaration, media query, value, and priority after canonical formatting, and verifies the exact Google Fonts URL.

## Architecture

- `src/app`: routes, shared providers, metadata, route-loading UI, and error recovery.
- `src/styles/tokens.css`: all 41 original custom properties.
- `src/styles/design.css`: all 902 original CSS declarations, including breakpoints, print rules, and reduced motion.
- `src/styles/foundation.css`: native-dialog and reusable-control support, plus wrapping for selected filenames.
- `src/components/ui`: typed buttons, icon buttons, cards, badges, fields, selects, textareas, checkboxes, radios, notices, modal, progress bar, and toast provider.
- `src/components/layout`: shared application shell, route navigation, workflow stepper, section navigation, and page headings.
- `src/components/design-system`: reference typography, colors, spacing, components, navigation, and voice gallery.
- `src/components/onboarding`: upload entry, reusable upload card, and sample analysis screen.
- `src/components/pdf`: the illustrated sample document with working 100%/115% zoom.
- `src/features/intake`: typed validation results and session-local selection state.
- `src/data/sample-form.ts`: explicitly prepared sample metadata with 12 distinct original field identifiers across three sections.
- `src/lib`: typed route metadata and class-name helper.
- `tests/intake.test.mjs`: executable file-intake regression tests.
- `scripts`: visual-token regression check and full-source exporter.

Tailwind 3 is intentional: the original uses the Tailwind 3 CDN. Compiled utilities replace that CDN while retaining its preflight behavior. Theme utilities refer to the original CSS variables. Original CSS loads after generated utilities, as in the reference. The font URL, requested weights, and fallback stacks are unchanged. Fonts require an internet connection.

## Phase 2 behavior

There is no authentication screen because the reference explicitly offers a guest experience with no account needed.

The browser validates one file at a time, rejects empty files and files over 10 MiB (shown as 10 MB in the reference), requires a `.pdf` filename, and reads the first five bytes to check for `%PDF-`. Browser MIME metadata is not trusted as proof of document format. A matching header does **not** establish that the entire file is a readable or fillable PDF; the selected-file message explicitly describes the limited checks.

Picker cancellation leaves the current selection unchanged. Selecting the same file again is supported. A later selection or cancellation invalidates an earlier pending read, so stale asynchronous results cannot replace the current state. Drag-and-drop uses the same validation service, including rejecting multiple files.

The original `File` object is held only in React context. It survives navigation within the application and can be removed explicitly. Reloading or closing the tab clears it. Files are never sent to a server, stored in browser storage, or substituted into the prepared sample analysis. Opening the sample leaves a selected upload available when returning to the entry screen.

The analysis route always shows the clearly labeled, fictional Northbridge sample. Its 12 fields, three sections, optional-student-ID suggestion, and document illustration come from typed sample data, not a live AI request. The route-loading state reflects loading that screen; it does not simulate document parsing or fabricate analysis progress.

The help dialog explains the currently available experience. Native dialog focus containment, Escape dismissal, and focus restoration remain available from Phase 1.

## Phase boundary

Completed: the guest entry screen, upload interactions and validation, prepared sample onboarding, navigation, loading/error feedback, and local selection state.

Reserved for Phase 3: real PDF parsing and rendering, AI analysis, guided answer entry and validation, review, filling/exporting the original PDF, and application persistence. Later screen navigation and the sample’s guided-form button remain visibly disabled, with the phase boundary stated beside the action. No empty routes or unfinished implementations stand in for those features.

## Full source delivery

`PHASE_2_SOURCE.md` contains the complete current contents of every source, configuration, test, and documentation file, including the dependency lockfile. It includes the Phase 1 foundation on which Phase 2 builds. It excludes generated builds, installed dependencies, the unchanged visual reference, and the generated delivery documents themselves.

`PHASE_1_SOURCE.md` is retained as the historical Phase 1 snapshot.

```bash
npm run export:source
```

## Dependency notes

No dependencies were added for Phase 2. At Phase 1 installation, `npm audit --omit=dev` reported zero production dependency advisories. The full audit reported nine development-tool advisories (seven high, two moderate), involving the Tailwind 3/ESLint glob and CSS-parser dependency chains. They concern processing crafted glob patterns or selectors in local tooling. Tailwind 3 is retained to preserve the reference preflight; the audit’s proposed major-version changes were not applied automatically. Re-evaluate these development dependencies before deployment or a Tailwind migration.
