# Shared Wiring Verification Patterns

Reference document for verification agents (`gsd-verifier`, `gsd-integration-checker`).

## Pattern: Component -> API

```bash
grep -E "fetch\(['\"].*$api_path|axios\.(get|post).*$api_path" "$component" 2>/dev/null
grep -A 5 "fetch\|axios" "$component" | grep -E "await|\.then|setData|setState" 2>/dev/null
```

**Status:**
- **WIRED:** Call exists AND response is handled (await/then/setState)
- **PARTIAL:** Call exists but response is not used
- **NOT_WIRED:** No call to API found

## Pattern: API -> Database

```bash
grep -E "prisma\.$model|db\.$model|$model\.(find|create|update|delete)" "$route" 2>/dev/null
grep -E "return.*json.*\w+|res\.json\(\w+" "$route" 2>/dev/null
```

**Status:**
- **WIRED:** Query exists AND result is returned in response
- **PARTIAL:** Query exists but returns static data instead of query result
- **NOT_WIRED:** No database query found

## Pattern: Form -> Handler

```bash
grep -E "onSubmit=\{|handleSubmit" "$component" 2>/dev/null
grep -A 10 "onSubmit.*=" "$component" | grep -E "fetch|axios|mutate|dispatch" 2>/dev/null
```

**Status:**
- **WIRED:** Handler exists AND makes API call
- **STUB:** Handler only logs or calls preventDefault
- **NOT_WIRED:** No submit handler found

## Pattern: State -> Render

```bash
grep -E "useState.*$state_var|\[$state_var," "$component" 2>/dev/null
grep -E "\{.*$state_var.*\}|\{$state_var\." "$component" 2>/dev/null
```

**Status:**
- **WIRED:** State variable exists AND is rendered in JSX
- **NOT_WIRED:** State exists but is not rendered

## Usage Notes

These patterns assume a React/Next.js codebase by default. Adapt the grep patterns for other frameworks:

- **Vue/Nuxt:** Replace `fetch`/`axios` with `$fetch`/`useFetch`, `useState` with `ref`/`reactive`
- **Python/Django:** Replace with `requests`, Django ORM patterns, form handling
- **Go:** Replace with `http.Client`, GORM patterns, handler functions
- **Generic:** Use HTTP client, SQL, and middleware pattern matching
