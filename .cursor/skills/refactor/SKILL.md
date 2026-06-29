---
name: refactor-candidates-after-tdd
description: Lists refactor smells to hunt after a green TDD cycle—duplication, long methods, shallow modules, feature envy, primitive obsession, and legacy code surfaced by new tests. Use when refactoring, tightening design after tests pass, or when the user mentions post-TDD cleanup or refactor candidates.
disable-model-invocation: true
---

# Refactor Candidates

After TDD cycle, look for:

Duplication → Extract function/class
Long methods → Break into private helpers (keep tests on public interface)
Shallow modules → Combine or deepen
Feature envy → Move logic to where data lives
Primitive obsession → Introduce value objects
Existing code the new code reveals as problematic
