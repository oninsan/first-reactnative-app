# Code review — Expo Todo demo app

**Reviewer:** 2026-06-29
**Plan:** `.cursor/a-team/board/plan.md`
**Build log:** `.cursor/a-team/board/build-log.md`
**Verdict:** **approve-with-nits**

## Plan conformance

| Acceptance criterion | Status | Notes |
|---------------------|--------|-------|
| `npm install` clean; `tsc` + `lint` pass | ✅ | Verified: `npx tsc --noEmit` and `npm run lint` exit 0 |
| `npx expo start` boots; Expo Go compatible | ✅ | `index.ts` + `package.json` `"main": "index.ts"` + `registerRootComponent`; deps are Expo Go–safe; build-log `expo-doctor` 21/21 |
| Add / toggle / delete / empty state / persistence | ✅ | `useTasks` + components implement all behaviors; load-before-save guard present |
| File structure & layering per plan | ✅ | All planned `src/` files present; AsyncStorage only in `taskStorage.ts` |
| Thin components, concept comments, theme tokens | ✅ | Screens/components are presentational; `@/` imports throughout app code |
| README | ⏸ Deferred | Documenter scope per build-log; not held against Builder |

## Findings

### Blocker

_None._

### High

_None._

### Medium

- **`src/components/TaskList.tsx:17`** — `FlatList` has no `style={{ flex: 1 }}` while sitting below `Header` and `AddTaskInput` in a `flex: 1` column. Without a bounded height, long lists may not scroll inside the remaining viewport (common RN layout footgun). **Why it matters:** A live demo where the instructor adds many tasks can break scrolling or virtualization. **Fix:** Add `style={styles.list}` with `flex: 1` on `FlatList` (keep `contentContainerStyle` for empty-state `flexGrow`).

- **`app.json:3-4`** — `name` and `slug` are still `_expo_temp` from the scaffold move. **Why it matters:** Expo Go / dev tools show the wrong project name; confusing for students on day one. **Fix:** Rename to `first_reactnative_app` (or a friendly display name like `My Tasks Demo`) and align `slug`.

### Low

- **`src/hooks/useTasks.ts:34`** — `saveTasks(tasks)` is invoked inside `useEffect` without `await` or error handling. **Why it matters:** A rare AsyncStorage failure surfaces as an unhandled promise rejection (noise in Metro, not a crash). **Fix:** Optional for demo — `void saveTasks(tasks).catch(...)` or a small try/catch inside the effect.

- **`src/services/taskStorage.ts:17`** — Parsed JSON is cast `as Task[]` without shape checks. **Why it matters:** Corrupt storage could render rows with missing `title`/`completed`. **Fix:** Optional guard (filter/map) or reset to `[]` on invalid items; acceptable for a teaching demo.

- **`src/hooks/useTasks.ts:30-35`** — When `loading` flips to `false`, save runs once with freshly loaded tasks (redundant write). Harmless; no action required.

### Nit

- **`src/theme/index.ts:8`** — `accentLight` is defined but unused. Remove or use (e.g. empty-state background) to avoid “dead token” noise when teaching theme files.

- **`index.ts:3`** — Relative `import App from './App'` is fine at the entry boundary; only cross-`src/` imports are required to use `@/` per plan.

## Design notes (deep-modules / tests)

**Deep modules (good):** The stack matches the intended teaching shape — thin UI (`TasksScreen`, `TaskItem`, etc.), a single hook (`useTasks`) that owns state, effects, and persistence orchestration, and a small IO module (`taskStorage`) hiding AsyncStorage details. Students see one place for “business + persistence” and one for “storage keys/JSON,” without screens calling storage directly.

**Shallow pass-through:** None problematic; components receive props/callbacks only.

**Tests:** Not required for this demo; no tests added (appropriate).

**Entry point:** `index.ts` → `registerRootComponent(App)` → `App.tsx` → `TasksScreen` is the standard Expo blank template pattern. Babel `module-resolver` (`@` → `./src`) and `tsconfig` paths (`@/*` → `src/*`) are aligned — alias should resolve at runtime and type-check.

**Persistence race:** Load-before-save guard is correct: `loading` starts `true`, save effect no-ops until hydrate completes, cancellation flag on unmount avoids stale `setState`. Safe for demo reloads.

**React correctness:** `FlatList` uses `keyExtractor` on `item.id`; `AddTaskInput` is controlled with clear-on-add; effect deps `[tasks, loading]` are appropriate; `keyboardShouldPersistTaps="handled"` on list; `KeyboardAvoidingView` with iOS `padding` per plan.

**Security (brief):** AsyncStorage for non-PII tasks matches plan D3; no secrets in bundle. Defer token/PII storage depth to Red Team.

## Hand-off

**Builder:** No must-fix items for a basic live demo (add/toggle/delete/empty/persistence, Expo boot). **Recommended before Documenter polish:**

1. Add `flex: 1` to `FlatList` in `TaskList.tsx` (Medium — scrolling with many tasks).
2. Fix `app.json` `name` / `slug` away from `_expo_temp` (Medium — student-facing polish).

Optional: unused `accentLight` token; save error handling in `useTasks`.

**Red Team:** AsyncStorage choice for tasks is intentional; review for demo-appropriate data handling only.
