# AGENTS.md

This file orients agents (Claude Code, Hermes, Cursor, etc.) operating in this repository.

## Agent skills

### Issue tracker

GitHub Issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. Glossary at `CONTEXT.md`. Architectural decisions in `docs/adr/`. See `docs/agents/domain.md`.

## Project conventions

- Stack: Svelte 5 (runes) + TypeScript + Vite. Vanilla, no SvelteKit. See ADR-0001.
- Game logic is pure TypeScript in `src/lib/game/` and is testable with Vitest.
- Talismãs are pure functions receiving the outcome/settlement and returning `{multiplier, bonus, notes}`.
- The house edge is fixed and disclosed. All randomness is via `crypto.getRandomValues`. No purchase, no withdrawal, no IAP. See ADR-0002.
- Workflow: see `docs/workflow.md`. Specs live in `docs/specs/`. Spec is reviewed before implementation.