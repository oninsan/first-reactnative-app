# Mission: Expo Todo demo app for first-time React Native students

## Goal

Scaffold a polished, beginner-friendly **Expo + TypeScript Todo app** from scratch in an
empty repo, to be used as a LIVE TEACHING DEMO. Priority #1: the demo is seamless
(`npx expo start` just works in Expo Go) and the code is easy to teach to beginners.

## Scope & constraints

- **In scope:** Full Expo SDK (latest stable) + TypeScript scaffold, `src/` layering
  (screens/components/hooks/services/theme/types), a Todo/Task list app demonstrating
  components, props, `useState`, `FlatList`, `TextInput`, basic styling; `@/` path alias;
  ESLint + `tsc --noEmit` passing; beginner-friendly `README.md`.
- **Out of scope:** Native modules requiring custom dev builds / `pod install`; backends;
  auth; navigation libraries; a second styling system. Tests optional.
- **Constraints:** Expo Go-compatible deps only. StyleSheet for styling. No secrets in
  bundle. Keep components thin (UI → hook → service). No git commits unless asked.

## Phase

**done**

## Agent status

| Agent | Status | Notes |
|-------|--------|-------|
| Scout | done | Greenfield repo; only `.cursor/` rules present. See scout-report.md |
| Planner | done | Plan finalized; user pre-specified requirements, no grill needed. See plan.md |
| Builder | done | Scaffold + full src layering; tsc + lint + expo-doctor pass. See build-log.md |
| Reviewer | done | approve-with-nits; see review.md — FlatList flex + app.json name |
| Red Team | done | Clean for demo scope; no Critical/High. See redteam.md |
| Documenter | done | README.md: run guide, file tour, data flow, teaching talking points |

## Decisions log

| ID | Topic | Status | Resolution |
|----|-------|--------|------------|
| D1 | App idea | resolved | Todo/Task list app |
| D2 | Template | resolved | `create-expo-app --template blank-typescript` (no expo-router; simplest for beginners) |
| D3 | Persistence | resolved | AsyncStorage via `services/taskStorage` (Expo Go compatible; teaches hooks+services) |
| D4 | Styling | resolved | StyleSheet + central `src/theme` tokens |
| D5 | Path alias | resolved | `@/` → `src/` via tsconfig paths + babel-plugin-module-resolver |
| D6 | Lint | resolved | eslint-config-expo + `npm run lint` |

## Handoff notes

- Builder: read `plan.md`, scaffold then implement strictly. Verify `npx tsc --noEmit` and
  `npm run lint` pass and deps install cleanly.
