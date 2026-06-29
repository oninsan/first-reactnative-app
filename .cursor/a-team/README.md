# A-Team — shared memory & orchestration protocol

The **A-Team** is a squad of specialized Cursor agents that collaborate on a single
mission. Cursor subagents run in **isolated contexts** (no built-in shared memory), so
this folder *is* the shared memory. Every agent reads it for context before working and
writes its output back so the next agent can pick up where the last one left off.

## The board

The shared state lives in `.cursor/a-team/board/`. One file per concern:

| File | Owner (writer) | Purpose |
|------|----------------|---------|
| `mission.md` | Orchestrator | The goal, scope, constraints, current phase, and status of each agent. The single source of truth for "what are we doing and where are we". |
| `scout-report.md` | Scout | Map of relevant files, entry points, data flow, conventions, and open questions. |
| `plan.md` | Planner | The agreed implementation plan: steps, files to touch, decisions, acceptance criteria. |
| `build-log.md` | Builder | What was changed and why, file-by-file; deviations from the plan; follow-ups. |
| `review.md` | Reviewer | Findings against the plan + code quality, severity-tagged, with verdict (approve / changes requested). |
| `redteam.md` | Red Team | Security findings using the `security-bug-scan` severity rubric. |
| `docs.md` | Documenter | Summary of doc changes and where user-facing docs were updated. |

A `board/` is per-mission. When a new mission starts, the orchestrator resets the board
(see `board/templates/`). Old missions can be archived under `board/archive/<date>-<slug>/`.

## Protocol (every agent follows this)

1. **Read first.** Before doing anything, read `board/mission.md` and any sibling files
   relevant to your role. Never re-investigate what a teammate already recorded — build on it.
2. **Do your job** within your role's scope (see each agent definition).
3. **Write back.** Update your own board file with a structured, skimmable report.
   Update the `## Status` line for your role in `mission.md` (or hand that back to the
   orchestrator if you ran read-only).
4. **Hand off.** End your turn with a short summary of what changed and what the next
   agent needs to know. The orchestrator uses this to launch the next agent.

## Write discipline

- Specialist agents only write to **their own board file** plus the shared sections noted
  above — they must not clobber another agent's file.
- **Scout, Planner, Reviewer, Red Team** must not modify source code or app files. Their
  only writes are to `.cursor/a-team/board/**`.
- **Builder** modifies source code. **Documenter** modifies `docs/**` and code-adjacent docs.
- Keep entries dated and append-only where history matters (build log, review rounds).

## Roster

- **Scout** (`/scout`) — investigation & code reading.
- **Planner** (`/planner`) — designs the solution; grills the user via the `grill-me` skill.
- **Builder** (`/builder`) — implements the plan strictly and comprehensively.
- **Reviewer** (`/reviewer`) — reviews against plan + craft using `deep-modules`, `good-and-bad-tests`, `refactor`.
- **Documenter** (`/documenter`) — documents the change.
- **Red Team** (`/red-team`) — security review via the `security-bug-scan` skill.
- **A-Team** (`/a-team`) — orchestrator that runs the squad end to end.
