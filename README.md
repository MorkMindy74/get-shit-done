<div align="center">

# ARSENALE

**Multi-agent orchestration engine for AI-driven software development.**

**Parallel execution. Goal-backward verification. Persistent state across sessions.**

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

</div>

```bash
npx arsenale@latest
```

Works on Mac, Windows, and Linux.

---

## Why Arsenale

The Arsenale di Venezia (1104 AD) was the world's first industrial-scale factory: 16,000 specialized workers, parallel assembly lines, capable of building a complete warship in a single day — five centuries before Ford.

That is exactly what this system does for software development.

Most AI coding workflows fail at scale not because of model quality, but because of **context rot** — the progressive degradation of accuracy as the context window fills. Arsenale solves this with a structured orchestration layer: specialized agents working in parallel, fresh context per task, persistent state that survives session resets.

---

## How It Works

### 1. Initialize Project
```
/arsenale:new-project
```
One command. The system questions until it understands your idea completely, spawns parallel research agents, extracts requirements, and creates a phased roadmap. You approve. Then you build.

**Creates:** `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `.planning/research/`

### 2. Discuss Phase
```
/arsenale:discuss-phase 1
```
Shape the implementation before anything gets planned. The system identifies gray areas based on what is being built and captures your decisions in `CONTEXT.md`, which feeds directly into research and planning.

**Creates:** `{phase_num}-CONTEXT.md`

### 3. Plan Phase
```
/arsenale:plan-phase 1
```
The system researches the domain, creates atomic task plans with XML structure, and verifies plans against requirements — looping until they pass. Each plan fits cleanly within a fresh context window.

**Creates:** `{phase_num}-RESEARCH.md`, `{phase_num}-{N}-PLAN.md`

### 4. Execute Phase
```
/arsenale:execute-phase 1
```
Plans run in dependency-aware waves. Independent plans execute in parallel, each in a fresh 200k-token context. Every task gets its own atomic commit. Verification runs automatically when the phase completes.

**Creates:** `{phase_num}-{N}-SUMMARY.md`, `{phase_num}-VERIFICATION.md`

### 5. Verify Work
```
/arsenale:verify-work 1
```
User acceptance testing with automated diagnosis. If something fails, debug agents find the root cause and create fix plans for immediate re-execution.

**Creates:** `{phase_num}-UAT.md`, fix plans if issues found

### 6. Repeat
```
/arsenale:discuss-phase 2
/arsenale:plan-phase 2
/arsenale:execute-phase 2
/arsenale:verify-work 2
...
/arsenale:complete-milestone
/arsenale:new-milestone
```

Each phase: your input → research → execution → verification. Context stays fresh. Quality stays high.

---

## Why It Works

### Context Engineering

| File | Purpose |
|------|---------|
| `PROJECT.md` | Project vision, always loaded |
| `research/` | Domain knowledge per phase |
| `REQUIREMENTS.md` | Scoped requirements with phase traceability |
| `ROADMAP.md` | Phases and completion status |
| `STATE.md` | Decisions, blockers, position — memory across sessions |
| `PLAN.md` | Atomic task with XML structure and verification steps |
| `SUMMARY.md` | What happened, what changed, committed to history |

### Multi-Agent Orchestration

Every stage uses the same pattern: a thin orchestrator spawns specialized agents, collects results, and routes to the next step.

| Stage | Orchestrator | Agents |
|-------|-------------|--------|
| Research | Coordinates, presents findings | 4 parallel researchers (stack, features, architecture, pitfalls) |
| Planning | Validates, manages iteration | Planner creates, checker verifies, loop until pass |
| Execution | Groups into waves, tracks progress | Executors in parallel, each with fresh 200k context |
| Verification | Presents results, routes next | Verifier checks goals, debuggers diagnose failures |

The result: an entire phase — deep research, multiple plans, thousands of lines written in parallel — while your main context window stays at 30-40%.

### Wave Execution

```
PHASE EXECUTION
────────────────────────────────────────────────
WAVE 1 (parallel)      WAVE 2 (parallel)    WAVE 3
┌─────────┐┌─────────┐ ┌─────────┐┌─────────┐ ┌─────────┐
│ Plan 01 ││ Plan 02 │→│ Plan 03 ││ Plan 04 │→│ Plan 05 │
│  User   ││ Product │ │ Orders  ││  Cart   │ │Checkout │
│  Model  ││  Model  │ │   API   ││   API   │ │   UI    │
└─────────┘└─────────┘ └─────────┘└─────────┘ └─────────┘
```

### Atomic Git Commits

Every task gets its own commit immediately after completion. Clean history, surgical revert, full traceability.

---

## Commands

### Core Workflow

| Command | What it does |
|---------|-------------|
| `/arsenale:new-project [--auto]` | Full initialization: questions → research → requirements → roadmap |
| `/arsenale:discuss-phase [N] [--auto]` | Capture implementation decisions before planning |
| `/arsenale:plan-phase [N] [--auto]` | Research + plan + verify for a phase |
| `/arsenale:execute-phase <N>` | Execute all plans in parallel waves, verify when complete |
| `/arsenale:verify-work [N]` | User acceptance testing |
| `/arsenale:complete-milestone` | Archive milestone, tag release |
| `/arsenale:new-milestone [name]` | Start next version |

### Navigation

| Command | What it does |
|---------|-------------|
| `/arsenale:progress` | Where am I? What is next? |
| `/arsenale:help` | Show all commands and usage guide |
| `/arsenale:update` | Update with changelog preview |

### Phase Management

| Command | What it does |
|---------|-------------|
| `/arsenale:add-phase` | Append phase to roadmap |
| `/arsenale:insert-phase [N]` | Insert urgent work between phases |
| `/arsenale:remove-phase [N]` | Remove future phase, renumber |
| `/arsenale:plan-milestone-gaps` | Create phases to close milestone gaps |

### Utilities

| Command | What it does |
|---------|-------------|
| `/arsenale:quick [--full]` | Execute ad-hoc task (--full adds plan-checking and verification) |
| `/arsenale:debug [desc]` | Systematic debugging with persistent state |
| `/arsenale:health [--repair]` | Validate `.planning/` integrity, auto-repair with --repair |
| `/arsenale:map-codebase` | Analyze existing codebase before new-project |
| `/arsenale:settings` | Configure model profile and workflow agents |
| `/arsenale:add-todo [desc]` | Capture idea for later |
| `/arsenale:check-todos` | List pending todos |

---

## Installation

```bash
npx arsenale@latest
```

The installer prompts for:
- **Runtime** — Claude Code, OpenCode, Gemini, or all
- - **Location** — Global (all projects) or local (current project only)
 
  - ### Non-interactive Install
 
  - ```bash
    # Claude Code
    npx arsenale --claude --global   # Install to ~/.claude/
    npx arsenale --claude --local    # Install to ./.claude/

    # OpenCode
    npx arsenale --opencode --global

    # Gemini CLI
    npx arsenale --gemini --global

    # All runtimes
    npx arsenale --all --global
    ```

    ### Recommended: Skip Permissions Mode

    ```bash
    claude --dangerously-skip-permissions
    ```

    ---

    ## Configuration

    Settings are stored in `.planning/config.json`.

    ### Model Profiles

    | Profile | Planning | Execution | Verification |
    |---------|----------|-----------|--------------|
    | `quality` | Opus | Opus | Sonnet |
    | `balanced` (default) | Opus | Sonnet | Sonnet |
    | `budget` | Sonnet | Sonnet | Haiku |

    Switch profiles: `/arsenale:set-profile budget`

    ### Workflow Agents

    | Setting | Default | What it does |
    |---------|---------|-------------|
    | `workflow.research` | true | Researches domain before planning each phase |
    | `workflow.plan_check` | true | Verifies plans before execution |
    | `workflow.verifier` | true | Confirms deliverables after execution |
    | `workflow.auto_advance` | false | Auto-chain discuss → plan → execute |

    ---

    ## Security

    Protect sensitive files from agent reads:

    ```json
    {
      "permissions": {
        "deny": [
          "Read(.env)",
          "Read(.env.*)",
          "Read(**/secrets/*)",
          "Read(**/*credential*)",
          "Read(**/*.pem)",
          "Read(**/*.key)"
        ]
      }
    }
    ```

    ---

    ## License

    MIT License. See [LICENSE](LICENSE) for details.
