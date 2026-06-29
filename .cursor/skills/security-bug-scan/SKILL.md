---
name: security-bug-scan
description: Guides systematic security and correctness reviews of a React Native + TypeScript app—trust boundaries, secure storage, API auth, deep links, injection, secrets in the bundle, and platform (iOS/Android) surfaces—with evidence-backed findings and severity. Use when the user requests a security review, bug sweep, audit, threat model, pre-release scan, or assessment of a screen, hook, or service for vulnerabilities and likely bugs.
disable-model-invocation: true
---

# Security and bug-scan

## When to use

Apply on demand: full-repo scan, diff-only scan, release audit, "is this screen/service safe?", or a deep dive on auth/token storage paths.

Follow layering in [project-structure.mdc](../../rules/project-structure.mdc) and [tech-stack.mdc](../../rules/tech-stack.mdc): UI must not embed secrets or call native storage directly; data access goes through hooks/services; no secrets baked into the JS bundle.

## Robustness rules (output quality)

Each **finding** must include:

- **Severity** (see rubric below).
- **Confidence**: confirmed | likely | speculative.
- **Location**: file path and line or exported symbol.
- **Evidence**: minimal code citation or behavior description tied to that location.
- **Impact**: one sentence on exploitability or user/data impact.
- **Fix direction**: concrete next step (not a full unsolicited rewrite unless trivial).

Also:

- **Deduplicate** and **cluster** repeated patterns (e.g. duplicated fetch/auth snippets across services → one pattern finding plus 2–3 example paths).
- **Label** security vs reliability/correctness when the distinction matters.

## Phased workflow

Use as a checklist; adapt scope to the user's request.

### Phase A — Scope

- [ ] Confirm scope: whole repo, `src/services/**` only, `src/screens/**` + `src/components/**`, native code, or git diff.
- [ ] Map **surfaces**: authenticated screens vs public/onboarding screens, deep links / universal links, push notification handlers, and any native modules / config plugins.

### Phase B — Trust boundaries

- [ ] Trace **UI → hook → service → remote API** for the scoped flows.
- [ ] Identify **authentication mode**: token storage (SecureStore / Keychain / Keystore vs AsyncStorage), refresh flow, and where the auth header is attached.
- [ ] List where **user- or server-controlled values** (IDs, URLs, deep-link params, filenames, push payloads) reach navigation, storage, `WebView`, or outbound HTTP.

### Phase C — Pattern pass (directed, not grep-only)

- [ ] **Secret storage**: tokens/PII in `AsyncStorage` or plain files instead of `expo-secure-store` / Keychain / Keystore.
- [ ] **Secrets in the bundle**: API keys, signing secrets, or `.env` values shipped in the JS bundle (anything in the app binary is readable).
- [ ] **Transport**: non-HTTPS endpoints; disabled cert validation; allowing arbitrary loads (ATS exceptions / `usesCleartextTraffic`).
- [ ] **Authz / IDOR**: client trusts server scoping but never verifies; ID guessing on API calls reachable from the app.
- [ ] **Deep links / universal links**: unvalidated params driving navigation, auth, or actions; missing origin/scheme checks.
- [ ] **WebView**: `javascript:` injection, `originWhitelist: ['*']`, `injectedJavaScript` built from untrusted input, file access enabled.
- [ ] **Injection / eval**: dynamic `Function`/`eval`, unsafe template strings into native queries (SQLite), command-style strings.
- [ ] **Path / file handling**: user-controlled paths to `expo-file-system` / `react-native-fs`; unsafe extraction or downloads.
- [ ] **XSS-style sinks**: rendering untrusted HTML in `WebView`, unsanitized markdown.
- [ ] **Logging**: tokens, passwords, or PII in `console.log` / crash reports / analytics.
- [ ] **Permissions**: over-broad iOS/Android permissions vs what the feature needs.
- [ ] **Input validation**: server responses and form input trusted without shape/type validation before use.

### Phase D — Platform / framework

- [ ] **Navigation**: deep-link routes validate params before authorizing or fetching by key.
- [ ] **Push notifications**: payload-driven navigation/actions validated; no sensitive data in notification body.
- [ ] **Build config**: debug-only flags, dev menus, or verbose logging not shipped in release; source maps not exposed.
- [ ] **Native config**: `app.json` / `Info.plist` / `AndroidManifest.xml` exported activities, URL schemes, and ATS/cleartext settings reviewed.
- [ ] **Dependencies**: native modules with known CVEs; abandoned packages handling crypto/auth.

### Phase E — Project conventions

- [ ] **Screens/components stay thin**: heavy data/auth logic belongs in hooks/services per project rules.
- [ ] **Single API client**: auth header attached in one place; not duplicated/spoofable per call site.
- [ ] **Error handling**: failures don't leak internal detail to the UI or logs; auth failures handled (not silently swallowed).

### Phase F — Verification loop

- [ ] For every **Critical** or **High** finding, re-read surrounding code and callers to confirm; downgrade if a service/hook layer mitigates.
- [ ] Drop or merge speculative items that lack a plausible attack path in this app.

## Severity rubric

| Level | Meaning |
|-------|---------|
| **Critical** | Account takeover, RCE, hardcoded production secret in the bundle, or unrestricted bulk exfiltration of sensitive data. |
| **High** | Token/PII stored insecurely; auth bypass; deep-link or WebView injection leading to sensitive actions; disabled TLS validation. |
| **Medium** | Missing validation on lower-sensitivity flows; info leaks aiding attack chains; over-broad permissions or cleartext exceptions. |
| **Low** | Hardening gaps; verbose logging; debug flags; weak abuse controls on non-critical flows. |
| **Informational** | Defense-in-depth, style, or maintainability that indirectly affects security (e.g. duplicated auth blocks). |

## Report template

Copy and fill:

```markdown
## Executive summary
[2–4 sentences: highest risks, scope, overall posture]

## Critical and high findings
- **[Severity]** [Short title] — [file:line] — confidence: [confirmed/likely/speculative]
  - Evidence: …
  - Impact: …
  - Fix: …

## Medium and low findings
- …

## Patterns and recommendations
[Clustered themes, e.g. "centralize the API client + auth header"]

## Reliability / correctness (non-security)
[Bugs and edge cases worth fixing]

## Appendix — file index
[Bulleted list of touched files and one-line notes]
```
