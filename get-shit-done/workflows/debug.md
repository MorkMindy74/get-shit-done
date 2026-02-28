<purpose>
Debug issues using scientific method with subagent isolation. Accepts a bug description, spawns gsd-debugger agent, handles returns.

User provides symptoms; the debugger investigates autonomously. Checkpoints return control to the user when input is needed.
</purpose>

<process>

## Step 0: Initialize Context

```bash
INIT=$(node ~/.claude/get-shit-done/bin/gsd-tools.cjs state load)
```

Extract `commit_docs` from init JSON.

Resolve debugger model:
```bash
DEBUGGER_MODEL=$(node ~/.claude/get-shit-done/bin/gsd-tools.cjs resolve-model gsd-debugger --raw)
```

## Step 1: Check Active Sessions

```bash
ls .planning/debug/*.md 2>/dev/null | grep -v resolved | head -5
```

**If active sessions exist AND no $ARGUMENTS:**
- List sessions with status, current hypothesis, next action
- User picks a number to resume OR describes a new issue

**If $ARGUMENTS provided OR user describes new issue:**
- Continue to Step 2

## Step 2: Gather Symptoms (new issue only)

If resuming an existing session, skip to Step 3.

Collect from the user (use AskUserQuestion for each):

1. **Expected behavior** -- What should happen?
2. **Actual behavior** -- What happens instead?
3. **Error messages** -- Any errors? (paste or describe)
4. **Timeline** -- When did this start? Ever worked?
5. **Reproduction** -- How do you trigger it?

Generate a slug from user input (lowercase, hyphens, max 30 chars).

Confirm all symptoms gathered before spawning.

## Step 3: Spawn gsd-debugger Agent

**For new issues:**

```
Task(
  prompt="<objective>
Investigate issue: {slug}

**Summary:** {trigger}
</objective>

<symptoms>
expected: {expected}
actual: {actual}
errors: {errors}
reproduction: {reproduction}
timeline: {timeline}
</symptoms>

<mode>
symptoms_prefilled: true
goal: find_and_fix
</mode>

<debug_file>
Create: .planning/debug/{slug}.md
</debug_file>",
  subagent_type="gsd-debugger",
  model="{debugger_model}",
  description="Debug {slug}"
)
```

**For resuming sessions:**

```
Task(
  prompt="<objective>
Continue debugging {slug}. Evidence is in the debug file.
</objective>

<prior_state>
<files_to_read>
- .planning/debug/{slug}.md (Debug session state)
</files_to_read>
</prior_state>

<mode>
goal: find_and_fix
</mode>",
  subagent_type="gsd-debugger",
  model="{debugger_model}",
  description="Continue debug {slug}"
)
```

## Step 4: Handle Agent Return

**If `## ROOT CAUSE FOUND`:**
- Display root cause and evidence summary to user
- Offer options:
  - "Fix now" -- spawn fix subagent
  - "Plan fix" -- suggest `/gsd:plan-phase --gaps`
  - "Manual fix" -- done

**If `## DEBUG COMPLETE`:**
- Display fix summary and verification results
- Update STATE.md with resolution
- Commit if fix was applied (respects `commit_docs` config)

**If `## CHECKPOINT REACHED`:**
- Present checkpoint details to user
- Get user response
- Spawn continuation agent (Step 5)

**If `## INVESTIGATION INCONCLUSIVE`:**
- Show what was checked and eliminated
- Offer options:
  - "Continue investigating" -- spawn new agent with additional context
  - "Add more context" -- gather more symptoms, re-spawn
  - "Manual investigation" -- done

## Step 5: Spawn Continuation Agent (after checkpoint)

When user responds to a checkpoint, spawn a fresh agent:

```
Task(
  prompt="<objective>
Continue debugging {slug}. Evidence is in the debug file.
</objective>

<prior_state>
<files_to_read>
- .planning/debug/{slug}.md (Debug session state)
</files_to_read>
</prior_state>

<checkpoint_response>
**Type:** {checkpoint_type}
**Response:** {user_response}
</checkpoint_response>

<mode>
goal: find_and_fix
</mode>",
  subagent_type="gsd-debugger",
  model="{debugger_model}",
  description="Continue debug {slug}"
)
```

Return to Step 4 to handle the continuation agent's return.

## Step 6: Update STATE.md

After resolution:

```bash
node ~/.claude/get-shit-done/bin/gsd-tools.cjs state update --set "last_debug={slug}" --set "last_debug_status={status}"
```

## Step 7: Commit (if fix applied)

If the debugger applied a fix and `commit_docs` is enabled:

```bash
node ~/.claude/get-shit-done/bin/gsd-tools.cjs commit "docs: resolve debug {slug}" --files .planning/debug/resolved/{slug}.md
```

Code changes are committed by the debugger agent itself during the fix_and_verify step.

</process>

<success_criteria>
- [ ] Active sessions checked on entry
- [ ] Symptoms gathered completely (if new issue)
- [ ] gsd-debugger spawned with full context
- [ ] Checkpoints handled correctly (user response relayed)
- [ ] Root cause confirmed before any fix
- [ ] STATE.md updated after resolution
- [ ] Planning docs committed if configured
</success_criteria>
