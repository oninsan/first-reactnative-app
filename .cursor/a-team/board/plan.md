# Plan: Expo Todo demo app

> User pre-specified all requirements and wants an autonomous, seamless build, so no
> grill-me round was needed. Decisions are captured in `mission.md` (D1–D6).

## App idea

A single-screen **Task List (Todo) app**: add a task, see it in a `FlatList`, tap to
toggle complete, delete it, with an empty state and a live count. Persists across reloads
via AsyncStorage. Chosen because it cleanly showcases: components, props, `useState`,
`useEffect`, lists (`FlatList`), `TextInput`, and styling — without being overwhelming.

## Scaffold

1. `npx create-expo-app . --template blank-typescript --no-install` into the (empty) dir.
   (Use `--no-install` then `npm install` so we control the install step.)
2. `npx expo install @react-native-async-storage/async-storage` (Expo Go compatible).
3. Dev deps: `babel-plugin-module-resolver`, `eslint`, `eslint-config-expo`.
4. Wire `@/` alias: `tsconfig.json` `compilerOptions.paths` (`"@/*": ["src/*"]`,
   `baseUrl: "."`) + `babel.config.js` `module-resolver` plugin (alias `@ -> ./src`).
5. `package.json` scripts: keep `start/android/ios/web`; add `"lint": "eslint ."`,
   `"typecheck": "tsc --noEmit"`. Add `.eslintrc.js` (extends `expo`) + `.eslintignore`.

## File structure (target)

```
App.tsx                      # entry; renders <TasksScreen/> inside SafeArea
app.json                     # expo config (from template)
babel.config.js              # expo preset + module-resolver
tsconfig.json                # strict + @/ paths
.eslintrc.js / eslint.config # expo lint config
src/
  theme/index.ts             # colors, spacing, radius, fontSizes tokens
  types/task.ts              # Task type
  services/taskStorage.ts    # AsyncStorage load/save (IO layer)
  hooks/useTasks.ts          # state + add/toggle/remove + persistence effect
  screens/TasksScreen.tsx    # composes the UI; calls useTasks()
  components/
    AddTaskInput.tsx         # TextInput + add button (controlled input -> props)
    TaskItem.tsx             # one row; props: task, onToggle, onRemove
    TaskList.tsx             # FlatList wrapper + EmptyState
    EmptyState.tsx           # friendly empty illustration/text
    Header.tsx               # title + remaining count
README.md                    # beginner run guide + file tour + talking points
```

## Layering rules (must hold)

- Screens/components render only; no AsyncStorage calls inline.
- `useTasks` hook owns state + effects + calls `taskStorage` service.
- `taskStorage` is the only place touching AsyncStorage.
- All cross-module imports use `@/`. Colors/spacing come from `@/theme`.

## Key behaviors

- Add: trims input, ignores empty, prepends new task with `id` (crypto-free: `Date.now()`
  + random suffix), clears input.
- Toggle: flips `completed`; completed rows show strikethrough + muted color.
- Remove: deletes by id.
- Persistence: load on mount (`useEffect`), save whenever tasks change. Loading flag to
  avoid saving before initial load.
- Empty state shows when no tasks.

## UI/UX

- Light, modern palette (indigo accent, soft gray bg, white cards), rounded cards,
  generous spacing, subtle shadows, big friendly title, count subtitle, checkbox circle,
  press feedback. Responsive via flex; `SafeAreaView`/insets; `KeyboardAvoidingView` for
  the input on iOS.

## Acceptance criteria

- `npm install` clean; `npx tsc --noEmit` passes; `npm run lint` passes.
- `npx expo start` boots; app runs in Expo Go on iOS + Android.
- Add / toggle / delete / empty state / persistence all work.
- Code is clean, thin components, concept-explaining comments (not noise).
- README documents exact run commands + file tour + teaching talking points.
