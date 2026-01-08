# Config Loader Skill

Central configuration management for consistent path resolution and stage-aware operations.

## Purpose

This skill teaches agents how to use the central configuration system instead of hardcoded paths. All project paths are defined in `config/paths.yaml` to enable single-point updates when structure changes.

## Core Principle

**NEVER hardcode paths in agents, commands, or skills.**

Instead, reference paths from the central registry:
- `config/paths.yaml` - All project paths
- `config/stages.yaml` - Stage definitions and current stage

## How to Resolve Paths

### 1. Read the Path Registry

Before any operation involving file paths:

```yaml
# Read config/paths.yaml
# Identify the path category (terraform, backend, frontend, planning, etc.)
# Use the appropriate path
```

### 2. Detect Current Stage

The current stage can be determined from (in priority order):

1. **Explicit argument**: User passes `--stage mvp1`
2. **Environment variable**: `$STAGE` if set
3. **PROJECT_STATUS.md**: Check `planning/PROJECT_STATUS.md` for current stage
4. **Git tags**: Most recent stage tag on current commit
5. **Default**: First stage in `stages.yaml`

### 3. Variable Substitution

Paths may contain variables that need substitution:

| Variable | Source | Example |
|----------|--------|---------|
| `${STAGE}` | Current stage | `mvp1`, `mvp2`, `preprod`, `prod` |
| `${SERVICE_NAME}` | Service being created | `core`, `api` |
| `${FEATURE_NAME}` | Feature module name | `career_explorer`, `dashboard` |
| `${MODULE_NAME}` | Config module name | `career-explorer`, `user-profile` |
| `${DATE}` | Current date | `2026-01-05` |
| `${TIME}` | Current time | `1430` |
| `${VERSION}` | Semantic version | `1.0.0` |

## Path Categories

### Infrastructure Paths

```yaml
terraform:
  environments: terraform/environments
  current_environment: terraform/environments/${STAGE}
  modules: terraform/modules
```

**Usage:**
```bash
# Instead of: cd terraform/environments/dev
# Use: cd terraform/environments/${STAGE}
```

### Backend Paths

```yaml
backend:
  services: backend/services
  template: backend/services/_template
  service_pattern: backend/services/${SERVICE_NAME}
```

### Frontend Paths

```yaml
frontend:
  features: lib/features  # Flutter
  src: src  # React/Next.js
  components: src/components
  feature_pattern: lib/features/${FEATURE_NAME}
```

### Planning Paths

```yaml
planning:
  root: planning
  architecture: planning/architecture
  verification: planning/verification-logs
  verification_pattern: planning/verification-logs/${DATE}_${TIME}_${FEATURE}.md
```

### Knowledge Base Paths

```yaml
knowledge_base:
  root: knowledge-base
  decisions: knowledge-base/decisions
  agent_memory: knowledge-base/agent-memory
  patterns: knowledge-base/agent-memory/patterns.yaml
  quick_answers: knowledge-base/agent-memory/quick-answers.yaml
```

## Stage-Aware Operations

### Detecting Stage in Commands

```markdown
## Stage Detection

1. Check if stage was passed as argument
2. If not, read `planning/PROJECT_STATUS.md` for current stage
3. If not found, default to first stage

Current stage determines:
- Which environment configuration to use
- Which feature flags apply
- Which services are available
```

### Stage-Specific Configuration

```yaml
# Load from config/stages.yaml
stages:
  - name: mvp1
    description: "Core functionality"
    features: [core, auth]
  - name: mvp2
    description: "Extended features"
    features: [core, auth, analytics]
```

## Examples

### Example 1: Deploy Infrastructure Command

**Before (hardcoded):**
```markdown
cd terraform/environments/dev
terraform apply
```

**After (config-aware):**
```markdown
## Path Resolution
- Terraform environment: `${paths.terraform.current_environment}`
- Resolves to: `terraform/environments/${STAGE}`

## Stage Detection
Current stage from PROJECT_STATUS.md or argument

## Execution
cd terraform/environments/${STAGE}
terraform apply
```

### Example 2: Create Feature Module

**Before (hardcoded):**
```markdown
Create files in:
- src/features/{name}/
```

**After (config-aware):**
```markdown
## Path Resolution
- Frontend feature: `${paths.frontend.feature_pattern}`
- Resolves to: `lib/features/${FEATURE_NAME}` (Flutter)
- Or: `src/features/${FEATURE_NAME}` (React)
```

### Example 3: Verification Logs

**Before (hardcoded):**
```markdown
Save to planning/verification-logs/2026-01-05_1430_feature.md
```

**After (config-aware):**
```markdown
## Path Resolution
- Log location: `${paths.planning.verification_pattern}`
- Resolves to: `planning/verification-logs/${DATE}_${TIME}_${FEATURE}.md`
```

## Git Tag Strategy

Projects can use tags for stage management:

```yaml
git:
  strategy: tag-based
  tag_pattern: "${STAGE}-v${VERSION}"
```

### Finding Current Stage from Tags

```bash
# Get most recent stage tag
git describe --tags --match "*-v*" --abbrev=0 2>/dev/null || echo "mvp1-v0.0.0"
```

## Updating Paths

When project structure changes:

1. **Edit `config/paths.yaml`** - Update the relevant path
2. **No other changes needed** - Agents read paths dynamically
3. **Commit**: `git commit -m "config: update paths registry"`

## Validation

Agents should validate paths exist before use:

```bash
# Check path exists
if [[ ! -d "$RESOLVED_PATH" ]]; then
    echo "Error: Path does not exist: $RESOLVED_PATH"
    echo "Check config/paths.yaml for correct path"
    exit 1
fi
```

## Anti-Patterns

### Don't Do This

```markdown
# Hardcoded path
cd terraform/environments/dev
```

```markdown
# Magic strings
BACKEND_DIR="backend/api"
```

```markdown
# Assuming stage
Run in the dev environment
```

### Do This Instead

```markdown
# Reference config
cd ${paths.terraform.current_environment}
# Resolves via config/paths.yaml
```

```markdown
# Config reference
BACKEND_DIR="${paths.backend.services}"
```

```markdown
# Stage aware
Run in the ${STAGE} environment (detected from PROJECT_STATUS.md)
```

## Integration with Other Skills

This skill is foundational and should be used by:

- **code-verify** - For verification log paths
- **auto-scribe** - For knowledge base paths
- **stage-review** - For stage-aware operations
- **session-continuity** - For checkpoint paths

All commands and agents should follow this skill's patterns for path resolution.

## Benefits

1. **Single source of truth** - Change paths once
2. **Stage awareness** - Automatic environment selection
3. **Consistency** - All agents use same paths
4. **Maintainability** - Easy to refactor structure
5. **Portability** - Paths adapt to project structure
