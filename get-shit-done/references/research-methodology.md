# Shared Research Methodology

Reference document for research agents (`gsd-phase-researcher`, `gsd-project-researcher`).

## Philosophy

### Training Data = Hypothesis

Claude's training is 6-18 months stale. Knowledge may be outdated, incomplete, or wrong.

**Discipline:**
1. **Verify before asserting** -- check Context7 or official docs before stating capabilities
2. **Prefer current sources** -- Context7 and official docs trump training data
3. **Flag uncertainty** -- LOW confidence when only training data supports a claim

### Honest Reporting

- "I couldn't find X" is valuable (investigate differently)
- "LOW confidence" is valuable (flags for validation)
- "Sources contradict" is valuable (surfaces ambiguity)
- Never pad findings, state unverified claims as fact, or hide uncertainty

### Investigation, Not Confirmation

**Bad research:** Start with hypothesis, find supporting evidence
**Good research:** Gather evidence, form conclusions from evidence

Don't find articles supporting your initial guess -- find what the ecosystem actually uses and let evidence drive recommendations.

## Tool Strategy

### Tool Priority Order

| Priority | Tool | Use For | Trust Level |
|----------|------|---------|-------------|
| 1st | Context7 | Library APIs, features, configuration, versions | HIGH |
| 2nd | WebFetch | Official docs/READMEs not in Context7, changelogs | HIGH-MEDIUM |
| 3rd | WebSearch | Ecosystem discovery, community patterns, pitfalls | Needs verification |

**Context7 flow:**
1. `mcp__context7__resolve-library-id` with libraryName
2. `mcp__context7__query-docs` with resolved ID + specific query

**WebSearch tips:** Always include current year. Use multiple query variations. Cross-verify with authoritative sources.

### Enhanced Web Search (Brave API)

Check `brave_search` from init context. If `true`, use Brave Search for higher quality results:

```bash
node ~/.claude/get-shit-done/bin/gsd-tools.cjs websearch "your query" --limit 10
```

**Options:**
- `--limit N` -- Number of results (default: 10)
- `--freshness day|week|month` -- Restrict to recent content

If `brave_search: false` (or not set), use built-in WebSearch tool instead.

Brave Search provides an independent index (not Google/Bing dependent) with less SEO spam and faster responses.

### Verification Protocol

**WebSearch findings must be verified:**

```
For each finding:
1. Verify with Context7? YES -> HIGH confidence
2. Verify with official docs? YES -> MEDIUM confidence
3. Multiple sources agree? YES -> Increase one level
   Otherwise -> LOW confidence, flag for validation
```

Never present LOW confidence findings as authoritative.

## Source Hierarchy

| Level | Sources | Use |
|-------|---------|-----|
| HIGH | Context7, official documentation, official releases | State as fact |
| MEDIUM | WebSearch verified with official source, multiple credible sources agree | State with attribution |
| LOW | WebSearch only, single source, unverified | Flag as needing validation |

**Source priority:** Context7 > Official Docs > Official GitHub > WebSearch (verified) > WebSearch (unverified)

## Research Pitfalls

### Configuration Scope Blindness
**Trap:** Assuming global config means no project-scoping exists
**Prevention:** Verify ALL scopes (global, project, local, workspace)

### Deprecated Features
**Trap:** Old docs -> concluding feature doesn't exist
**Prevention:** Check current docs, changelog, version numbers

### Negative Claims Without Evidence
**Trap:** Definitive "X is not possible" without official verification
**Prevention:** Is this in official docs? Checked recent updates? "Didn't find" does not equal "doesn't exist"

### Single Source Reliance
**Trap:** One source for critical claims
**Prevention:** Require official docs + release notes + additional source

## Pre-Submission Checklist

- [ ] All domains investigated
- [ ] Negative claims verified with official docs
- [ ] Multiple sources for critical claims
- [ ] URLs provided for authoritative sources
- [ ] Publication dates checked (prefer recent/current)
- [ ] Confidence levels assigned honestly
- [ ] "What might I have missed?" review completed
