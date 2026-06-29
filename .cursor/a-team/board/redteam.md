## Executive summary

Scoped review of the Expo + TypeScript **local offline Todo demo** (`src/`, `App.tsx`, `app.json`, `package.json`). Attack surface is minimal: no network, auth, deep links, WebView, or native custom modules. **No Critical or High application-security findings.** Secrets are absent from the bundle; AsyncStorage holds only non-PII task text via the service layer; user input renders in React Native `<Text>` (no HTML/eval sinks). `npm audit` reports **0 high/critical**; 10 **moderate** issues are confined to transitive Expo CLI/build tooling (`uuid` → `xcode` → `@expo/config-plugins`), not the runtime app shipped to Expo Go. **Overall verdict: clean and proportionate for a beginner teaching demo.**

## Critical and high findings

_None._

## Medium and low findings

- **Low** — No runtime schema validation on persisted tasks — `src/services/taskStorage.ts:13-17` — confidence: confirmed
  - Evidence: After `JSON.parse`, only `Array.isArray(parsed)` is checked; items are cast `as Task[]` without verifying `id`/`title`/`completed` shape.
  - Impact: A device-local actor (backup restore, rooted device, or another app with storage access on some platforms) could plant malformed JSON. The app will not crash or eval code, but rows may render blank, duplicate `keyExtractor` keys may warn, or toggle/delete may no-op — minor integrity/UX issue only.
  - Fix: Optionally map/filter loaded array through a small `isTask()` guard before returning; discard invalid entries.

- **Low** — No upper bound on task title length — `src/hooks/useTasks.ts:37-49`, `src/components/AddTaskInput.tsx:27-34` — confidence: confirmed
  - Evidence: `addTask` trims and rejects empty strings but does not cap length before `saveTasks` → `JSON.stringify`.
  - Impact: Extremely long pasted input could bloat AsyncStorage and slow list render on the same device — local nuisance only, not cross-user.
  - Fix: `maxLength` on `TextInput` and/or truncate in `addTask` (e.g. 500–1000 chars) if teaching “input validation.”

- **Informational** — AsyncStorage is plaintext on device — `src/services/taskStorage.ts:1-25` — confidence: confirmed
  - Evidence: Sole persistence uses `@react-native-async-storage/async-storage` for `@tasks` key; no tokens/PII stored.
  - Impact: Task titles are readable to anyone with physical/device-backup access. Acceptable for demo todo text per project rules; would be wrong for secrets.
  - Fix: None required for current scope. If scope expands to sensitive notes, migrate secrets to `expo-secure-store` and keep tasks in AsyncStorage.

- **Informational** — Transitive `npm audit` moderate findings (dev/build chain only) — `package-lock.json` / `expo` dependency tree — confidence: confirmed
  - Evidence: `npm audit` → **10 moderate**, **0 high**, **0 critical**. Root cause: `uuid@<11.1.1` (GHSA-w5hq-g745-h8pq) via `xcode` → `@expo/config-plugins` → `@expo/cli` / `expo`. Suggested “fix” downgrades to `expo@46.0.21` (incorrect for SDK 56).
  - Impact: Affects Expo CLI/prebuild tooling on developer machines, not the offline Todo runtime in Expo Go. No plausible exploit path for end users of this demo.
  - Fix: Track upstream Expo SDK patches; avoid `npm audit fix --force`. Re-run audit when upgrading Expo.

## Patterns and recommendations

| Check | Result |
|-------|--------|
| Secrets in JS / `app.json` | **Pass** — no API keys, `.env` files, `process.env`, or hardcoded tokens |
| AsyncStorage scope | **Pass** — only `src/services/taskStorage.ts`; stores task JSON only |
| Malformed stored JSON | **Pass** — `JSON.parse` in try/catch; non-array → `[]`; no `eval` / dynamic `require` |
| User input rendering | **Pass** — `task.title` in `<Text>` (`TaskItem.tsx:29-34`); no WebView / `dangerouslySetInnerHTML` |
| Deep links / URL schemes | **Pass** — none in `app.json` or app code |
| Network / TLS / cleartext | **N/A** — no `fetch`, no ATS/cleartext overrides |
| Layering (UI → hook → service) | **Pass** — components/screens have no storage imports |
| Logging sensitive data | **Pass** — no `console.log` in `src/` |
| Direct dependencies | **Pass** — minimal Expo Go set: `expo`, `react-native`, `@react-native-async-storage/async-storage`, `expo-status-bar` |
| Over-broad permissions | **Pass** — default Expo template `app.json`; no extra iOS/Android permission plugins |

**Defense-in-depth (optional, not blocking):** Add task-shape validation on load; document in README that AsyncStorage is for non-sensitive demo data only.

## Reliability / correctness (non-security)

- `saveTasks` has no try/catch — storage quota errors would reject the promise unhandled in `useTasks` effect (`src/hooks/useTasks.ts:34`). Reliability only; no security impact.
- `app.json` still uses template `name`/`slug` `_expo_temp` — cosmetic for Documenter, not security.

## Appendix — file index

- `App.tsx` — entry; renders `TasksScreen` only
- `app.json` — default Expo config; no schemes, secrets, or cleartext flags
- `package.json` — four runtime deps; no risky/abandoned direct packages
- `src/services/taskStorage.ts` — sole AsyncStorage IO; safe JSON handling
- `src/hooks/useTasks.ts` — state/persistence; no network
- `src/components/TaskItem.tsx` — `<Text>` rendering of user titles
- `src/components/AddTaskInput.tsx` — controlled `TextInput`
- `src/screens/TasksScreen.tsx` — composes UI; calls `useTasks()`

## Hand-off to Builder (must-fix, ranked)

**No must-fix security items for release of this demo.**

Optional hardening (low priority):

1. Validate persisted task objects in `loadTasks` (Low — local storage integrity).
2. Cap task title length (Low — local storage abuse).
3. Monitor Expo SDK updates for transitive `uuid` advisory resolution (Informational — dev toolchain).
