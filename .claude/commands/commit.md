# Smart Git Commit

Create a well-structured git commit with conventional commit format.

## Usage

```
/commit                    # Auto-generate commit message from changes
/commit "<message>"        # Commit with provided message
/commit --amend            # Amend the last commit
```

## Process

### Step 1: Analyze Changes

1. Run `git status` to see staged and unstaged changes
2. Run `git diff --staged` to see what will be committed
3. If nothing is staged, offer to stage all changes

### Step 2: Generate Commit Message

Analyze the changes and generate a conventional commit message:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Build process, auxiliary tools

#### Scope:
Derive from the primary directory/module being changed.

### Step 3: Present for Approval

Show the proposed commit message:

```
Proposed commit:

  feat(auth): add password reset flow

  - Add forgot password endpoint
  - Create email template for reset link
  - Add token validation

Staged files:
  - src/auth/reset-password.ts
  - src/templates/reset-email.html
  - tests/auth/reset-password.test.ts

[Confirm/Edit/Cancel]
```

### Step 4: Execute Commit

If approved:
1. Create the commit with the message
2. Show commit hash and summary
3. Optionally offer to push

## Conventional Commits

This command follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- Clear history of changes
- Automatic changelog generation
- Semantic versioning support

## Examples

```
# Auto-generate from changes
/commit

# Provide your own message
/commit "fix: resolve null pointer in user service"

# Stage everything and commit
/commit --all "feat: complete authentication module"
```

## Integration

Works with:
- `/verify` - Run verification before committing
- `/status` - Update project status after milestone commits
- Pre-commit hooks for validation
