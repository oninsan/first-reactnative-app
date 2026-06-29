# Task List Demo — React Native teaching app

## What this app is

A single-screen **Task List (Todo)** app built with **Expo + TypeScript** for live classroom demos. Students add tasks, mark them complete, delete them, and see their list survive an app reload — all while learning core React Native ideas: **components**, **props**, **`useState`**, **`useEffect`**, **`FlatList`**, **`TextInput`**, **styling with `StyleSheet`**, and **simple persistence** with AsyncStorage.

## Prerequisites

- **Node.js** — v22 works fine. Install from [nodejs.org](https://nodejs.org/) if you do not have it.
- **Expo Go** on a physical phone — [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent).
- **No Xcode or Android Studio required** when using Expo Go on a real device over Wi‑Fi.

## Install

From the project directory:

```bash
npm install
```

Dependencies are already listed in `package.json`, including `@react-native-async-storage/async-storage` for saving tasks on the device.

## Run the demo

Start the Expo dev server:

```bash
npx expo start
```

A **QR code** appears in the terminal (and often in a browser tab).

| Platform | How to open the app |
|----------|---------------------|
| **iPhone** | Open the **Camera** app and scan the QR code. Tap the banner to open in Expo Go. |
| **Android** | Open the **Expo Go** app and scan the QR code from there. |
| **Same Wi‑Fi** | Phone and computer must be on the **same Wi‑Fi network**. |

**Keyboard shortcuts** in the terminal (after `npx expo start`):

| Key | Action |
|-----|--------|
| `i` | Open in the iOS Simulator (requires Xcode) |
| `a` | Open on an Android emulator (requires Android Studio) |
| `w` | Open in the web browser |
| `r` | Reload the app |

**Troubleshooting:** If the app hangs or shows a stale bundle, stop the server and run:

```bash
npx expo start -c
```

The `-c` flag clears the Metro cache.

## Project structure / file tour

```
first_reactnative_app/
├── index.ts                 # Expo entry — registers the root component
├── App.tsx                  # Root component — renders TasksScreen + StatusBar
├── app.json                 # Expo app config (name, icons, orientation)
├── babel.config.js          # Babel preset + @/ path alias for Metro
├── tsconfig.json            # TypeScript strict mode + @/ paths for the editor
├── package.json             # Dependencies and npm scripts
└── src/
    ├── screens/
    │   └── TasksScreen.tsx      # Main screen — composes UI, calls useTasks()
    ├── components/
    │   ├── Header.tsx           # Title + “N tasks remaining” (props only)
    │   ├── AddTaskInput.tsx     # TextInput + Add button (controlled input)
    │   ├── TaskList.tsx         # FlatList wrapper + empty state
    │   ├── TaskItem.tsx         # One task row — toggle + delete
    │   └── EmptyState.tsx       # Friendly message when the list is empty
    ├── hooks/
    │   └── useTasks.ts          # State, add/toggle/remove, load/save effects
    ├── services/
    │   └── taskStorage.ts       # AsyncStorage load/save (only IO layer)
    ├── theme/
    │   └── index.ts             # Shared colors, spacing, radius, font sizes
    └── types/
        └── task.ts              # Task TypeScript type
```

### Entry flow

`index.ts` → `App.tsx` → `TasksScreen`

1. **`index.ts`** — calls `registerRootComponent(App)` so Expo knows what to mount.
2. **`App.tsx`** — thin shell: renders `<TasksScreen />` and sets the status bar style.
3. **`TasksScreen`** — the screen students see; it wires components together and calls the hook.

### Layering (what to narrate in class)

| Layer | Folder | Role |
|-------|--------|------|
| **UI** | `src/screens/`, `src/components/` | Render only. Receive data and callbacks via **props**. No storage calls. |
| **Hook** | `src/hooks/useTasks.ts` | Owns **state** (`useState`), **side effects** (`useEffect`), and business actions (add, toggle, remove). |
| **Service** | `src/services/taskStorage.ts` | Talks to **AsyncStorage** — the only place that reads/writes persisted data. |

### The `@/` path alias

Imports like `import { useTasks } from '@/hooks/useTasks'` mean “start from `src/`.”

- **TypeScript** resolves `@/*` via `tsconfig.json` (`"@/*": ["src/*"]`).
- **Metro (bundler)** resolves `@` via `babel.config.js` (`module-resolver` alias `@` → `./src`).

Students can focus on *what* is imported, not how many `../` to count.

## How the data flows

- **`TasksScreen`** calls **`useTasks()`** and passes the returned values into child components.
- The hook holds the task list in **`useState`** and exposes **`addTask`**, **`toggleTask`**, and **`removeTask`**.
- On mount, a **`useEffect`** calls **`loadTasks()`** from the service; a loading spinner shows until data arrives.
- After the first load, another **`useEffect`** calls **`saveTasks(tasks)`** whenever the list changes.
- **`remainingCount`** is derived from `tasks` (count of items where `completed` is false).
- Components are **presentational**: they receive **data + callbacks via props** and do not touch AsyncStorage.

```
TasksScreen
  └─ useTasks()  ──►  taskStorage  ──►  AsyncStorage
        │
        ├─► Header(remainingCount)
        ├─► AddTaskInput(onAdd)
        └─► TaskList(tasks, onToggle, onRemove)
              └─► TaskItem (per row)
```

## Scripts

| Command | What it does |
|---------|----------------|
| `npm start` | Same as `npx expo start` — starts the Expo dev server |
| `npx expo start` | Starts Expo with QR code (recommended in docs) |
| `npm run lint` | Runs ESLint (`eslint .`) |
| `npm run typecheck` | Type-checks without emitting files (`tsc --noEmit`) |

Other scripts from the Expo template: `npm run android`, `npm run ios`, `npm run web`.

## Teaching talking points

Use this cheat-sheet to point students at real code during the demo.

- **Screen vs component** — `TasksScreen` (`src/screens/TasksScreen.tsx`) is the **screen** that composes the page; `Header`, `TaskItem`, etc. (`src/components/`) are **reusable UI pieces**.
- **Props (data down)** — `Header` receives `remainingCount` (`src/components/Header.tsx`, props type ~line 5–10). `TaskList` receives `tasks`, `onToggle`, `onRemove` (`src/components/TaskList.tsx`, ~lines 8–12).
- **Callbacks (events up)** — `AddTaskInput` calls `onAdd(text)` (`src/components/AddTaskInput.tsx`, ~lines 20–22). `TaskItem` calls `onToggle(task.id)` and `onRemove(task.id)` (~lines 22, 38).
- **`useState`** — Task list state in `useTasks` (`src/hooks/useTasks.ts`, ~lines 7–8). Local input text in `AddTaskInput` (~line 18).
- **Derived state** — `remainingCount` is computed from `tasks`, not stored separately (`src/hooks/useTasks.ts`, ~line 66).
- **`useEffect` (load on mount)** — Hydrates from storage once, with a cancel flag on unmount (`src/hooks/useTasks.ts`, ~lines 11–27).
- **`useEffect` (save on change)** — Persists after the initial load finishes (`src/hooks/useTasks.ts`, ~lines 30–37). Skips save while `loading` is true so empty state does not overwrite saved tasks.
- **`FlatList`** — Efficient list rendering (`src/components/TaskList.tsx`, ~lines 17–28).
- **`keyExtractor`** — Stable key per row: `item.id` (~line 20).
- **`ListEmptyComponent`** — Shows `EmptyState` when there are no tasks (~line 24).
- **Controlled `TextInput`** — `value={text}` + `onChangeText={setText}` (`src/components/AddTaskInput.tsx`, ~lines 27–30). Cleared after add (~line 22).
- **`StyleSheet` + theme tokens** — Shared palette in `src/theme/index.ts`; components import `colors`, `spacing`, etc. (e.g. `AddTaskInput.tsx` styles ~lines 46–78).
- **Layout / safe areas** — `SafeAreaView` avoids notches (`src/screens/TasksScreen.tsx`, ~lines 32–33). `KeyboardAvoidingView` lifts the input on iOS (~lines 33–36). `FlatList` uses `flex: 1` so long lists scroll (`src/components/TaskList.tsx`, ~lines 33–35).
- **Persistence layer** — Only `src/services/taskStorage.ts` imports AsyncStorage; the hook calls `loadTasks` / `saveTasks`, never the UI.

---

Built for first-time React Native students. Run `npx expo start`, scan the QR code, and teach from the code.
