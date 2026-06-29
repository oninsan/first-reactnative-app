# Scout report

## Environment

- Repo is **empty** except for `.cursor/` (rules + skills + a-team board). No `package.json`.
- Tooling: Node `v22.22.3`, npm `10.9.8`, `create-expo-app@4.0.0` available via npx.
- We are scaffolding from scratch.

## Conventions that apply (from `.cursor/rules/`)

- **project-structure.mdc**: React Native + TS. Layering under `src/`:
  - `src/screens/**`, `src/components/**` → UI only, thin, no fetch/storage inline.
  - `src/hooks/**` → stateful glue (data fetching, derived state, effects).
  - `src/services/**` → data/IO layer (storage, API). One owner per concern.
  - `src/types/**` → shared TS types. `src/utils/**` → pure helpers.
  - Tests under `__tests__/` (unit/components), `*.test.ts(x)`, import via `@/` alias.
- **tech-stack.mdc**: Prefer Expo workflow + repo scripts. Expo Go-compatible packages.
  StyleSheet styling; reuse theme tokens. Secure storage for tokens/PII (N/A here — tasks
  are not PII, AsyncStorage acceptable). Run `npm run lint` + `npx tsc --noEmit`.

## Implications for this mission

- No existing code to reuse; design folder layout fresh but conform to the layering above.
- Choose the simplest Expo template (blank-typescript) to avoid expo-router complexity.
- Add `@/` alias wiring (tsconfig + babel module-resolver) since rule mandates it.

## Open questions

- None blocking; user pre-specified all key requirements.
