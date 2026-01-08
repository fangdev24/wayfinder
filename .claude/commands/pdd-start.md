# Prompt-Driven Development: Start

Begin the PDD process to transform a rough idea into a detailed design with implementation plan.

## Process

You are starting a Prompt-Driven Development session. Follow these steps:

### 1. Gather the Rough Idea

Ask me for my rough idea. I can provide it as:
- Direct text in this conversation
- A file path to read
- A URL to fetch

Accept the rough idea in whatever format I provide.

### 2. Create Project Structure

Create the following structure in `planning/`:

```
planning/
├── rough-idea.md          # Save my initial idea here
├── idea-honing.md         # Requirements clarification Q&A
├── research/              # Research findings
├── design/                # Architecture and design docs
└── implementation/        # Implementation plans
```

### 3. Initial Planning

Ask me which approach I prefer:
1. Start with requirements clarification (default)
2. Start with preliminary research on specific topics
3. Provide additional context first

### 4. Requirements Clarification

Ask me ONE question at a time to refine the idea. Topics to cover:
- User stories and personas
- Technical constraints
- Integration requirements
- Success criteria
- Edge cases
- MVP scope vs future features

**Important**:
- Ask only ONE question, wait for my answer
- Record both question and answer in `planning/idea-honing.md`
- Adapt follow-up questions based on my answers
- Continue until requirements are clear

### 5. Research Phase

When ready for research:
1. Propose a research plan listing topics to investigate
2. Ask if I have specific resources to recommend
3. Document findings in `planning/research/` with separate files per topic

### 6. Checkpoint

Before moving to design, summarize:
- What we've established in requirements
- Key research findings
- Any gaps or uncertainties

Ask if I want to:
- Proceed to design
- Return to requirements clarification
- Do more research

### 7. Next Steps

After this initial session, use:
- `/pdd-design` to create detailed design documents
- `/pdd-implement` to create implementation plan
- `/pdd-status` to see current progress

## Arguments

$ARGUMENTS

If arguments are provided, treat them as the rough idea and proceed directly.
