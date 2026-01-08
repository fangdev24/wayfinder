# Prompt-Driven Development: Implementation Plan

Create a structured implementation plan with prompts for incremental development.

## Prerequisites

Before running this command, ensure:
- `planning/design/detailed-design.md` exists and is approved

## Process

### 1. Review Design

Read `planning/design/detailed-design.md` and understand:
- All components to be built
- Dependencies between components
- Testing requirements
- Security requirements

### 2. Create Implementation Plan

Create `planning/implementation/prompt-plan.md`:

```markdown
# Implementation Plan: [Feature Name]

## Checklist
- [ ] Prompt 1: Project setup and core interfaces
- [ ] Prompt 2: Data models and validation
- [ ] Prompt 3: Core business logic
- [ ] Prompt 4: Integration layer
- [ ] Prompt 5: Error handling and logging
- [ ] Prompt 6: Unit tests
- [ ] Prompt 7: Integration tests
- [ ] Prompt 8: Wire everything together
- [ ] Prompt 9: E2E testing and documentation

## Prompts

### Prompt 1: Project Setup and Core Interfaces

**Objective**: Establish project structure and define interfaces.

**Tasks**:
1. Create directory structure
2. Define types/interfaces for all data types
3. Create placeholder files for main components
4. Set up basic test framework

**Tests**: Smoke test that module loads without errors.

**Integration**: This is the foundation; subsequent prompts build on this.

---

### Prompt 2: Data Models and Validation

**Objective**: Implement data models with validation.

**Tasks**:
1. Implement model classes/types from interfaces
2. Add validation logic
3. Create factory functions for test data

**Tests**: Unit tests for validation rules.

**Integration**: Models used by all subsequent components.

---

[Continue with remaining prompts...]
```

### 3. Key Principles

Each prompt should:
- Have a **clear objective**
- List **specific tasks** (3-5 items)
- Define **test requirements**
- Explain **integration** with previous work
- Be **incremental** - no big complexity jumps

### 4. Security-First Ordering

Ensure the plan includes:
- Early: Data model with security considerations
- Middle: Core logic with proper error handling
- Late: Security review
- Final: Security validation before deployment

### 5. Checkpointing

Add checkpoint instructions:

```markdown
## Checkpoint Instructions

After completing each prompt:
1. Run all tests for that component
2. Commit changes with message: `feat: complete prompt N - {description}`
3. Update checklist in this file
4. Note any deviations or issues encountered
```

## Output

- `planning/implementation/prompt-plan.md` - Full implementation plan
- Clear checklist for tracking progress
- Prompts ready for execution

## Execution

To execute the plan:
1. Work through prompts sequentially
2. Use appropriate subagents for specialized work
3. Check off completed items
4. Use `/pdd-status` to track progress
