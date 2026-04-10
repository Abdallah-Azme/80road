# AI ENGINEERING RULES — NEXT.JS APPLICATION

---

## 🚨 FIRST RULE (MANDATORY)

Before writing any code:

1. Read this entire file
2. Confirm understanding
3. Create a detailed plan in markdown
4. DO NOT write code until plan is approved

---

# 🧠 CORE ARCHITECTURE

- Next.js (App Router ONLY)
- Server Components by default
- Feature-Based Architecture
- Service-Oriented Design

---

# 🧩 MCP ENFORCEMENT (CRITICAL)

You MUST verify ALL required tools are installed, configured, and working BEFORE development.

---

## ✅ REQUIRED STACK

- Next.js (latest, App Router)
- TailwindCSS
- shadcn/ui
- React Query (@tanstack/react-query)

---

## 🔍 MCP RESPONSIBILITIES

### 1. VERIFY INSTALLATION

If missing → INSTALL
If broken → FIX

---

### 2. VERIFY CONFIGURATION

You MUST ensure:

### Next.js

- App Router is used
- No Pages Router

### Tailwind

- Properly configured
- Connected to globals.css
- Classes render correctly

### shadcn

- Initialized correctly
- CLI working
- Components installable

### React Query

- QueryClient created
- QueryClientProvider configured
- HydrationBoundary working

---

## 🧪 MCP VALIDATION LOOP (MANDATORY)

Before writing any feature:

1. Test Tailwind (render styles)
2. Test shadcn (render component)
3. Test React Query (simple query)
4. Test hydration (server → client)
5. Ensure no errors

If ANY fails:
→ Fix
→ Re-test
→ Repeat

🚫 DO NOT CONTINUE until ALL pass

---

# 📁 FEATURE-BASED STRUCTURE (STRICT)

```
/features/
  /[feature-name]/
    /hooks/
    /services/
    /ui/
```

---

## RULES:

- Features must be isolated
- No cross-feature coupling
- Shared logic → `/shared`

---

# 🎯 UI RULES

- ONE component per file (STRICT)
- One export per file
- No business logic in UI
- UI = pure rendering

---

# 🔌 SERVICES LAYER (SOURCE OF TRUTH)

- ALL business logic lives in `/services`
- ALL API calls live in `/services`
- Services must be:
  - Reusable
  - Framework-agnostic

🚫 No React inside services
🚫 No UI logic

---

# 🔄 DATA FETCHING ARCHITECTURE (REACT QUERY)

---

## 🧠 CORE RULE

React Query MUST be used for:

- Fetching
- Caching
- Sync

---

## ⚡ SERVER PREFETCHING (MANDATORY)

Flow:

1. Prefetch in Server Component
2. Dehydrate query client
3. Pass state to client
4. Hydrate with React Query

---

## RULES:

- NO duplicate fetching
- NO client-only fetching if avoidable
- ALWAYS prefer server prefetch

---

# 🔁 CLIENT DATA ACCESS

- useQuery → for fetching
- useMutation → for UI state ONLY

---

# 🔄 MUTATIONS (IMPORTANT)

- MUST live in `/services`
- MUST be reusable functions

### Can be used in:

- Client Components
- Server Components
- Server Actions (OPTIONAL)

---

## ❗ RULES:

- DO NOT couple mutations to Server Actions
- DO NOT put logic in UI

---

## PRINCIPLE:

> Services = Source of Truth
> Server Actions = Optional Adapter

---

# ⏳ SUSPENSE (MANDATORY)

- ALL async UI MUST use Suspense

Rules:

- Always provide fallback UI
- No empty fallbacks

---

# 💥 ERROR HANDLING

- Every major UI MUST have Error Boundary

---

# 🪝 HOOKS

- Located in `/hooks`
- Handle:
  - State
  - Client logic

---

# 🎨 TAILWIND RULES

- Tailwind ONLY (no inline styles)
- Use consistent tokens
- No random values

---

# 🧱 SHADCN RULES

- Use shadcn components FIRST
- DO NOT rebuild existing components
- Extend via composition ONLY

---

# 🧪 DATA VALIDATION LOOP

Before completing any feature:

1. Server prefetch works
2. Hydration works
3. No duplicate requests
4. Suspense works
5. Error Boundary works

---

# 🔁 WORKFLOW LOOP (MANDATORY)

For EACH feature:

1. Plan
2. Implement
3. Test
4. Validate against ALL rules
5. Fix issues
6. Re-test

Repeat until PERFECT

---

# ❌ STRICTLY FORBIDDEN

- Multiple components per file
- Business logic in UI
- Skipping MCP validation
- Duplicate fetching
- Ignoring React Query
- Rebuilding shadcn components
- Writing code before planning

---

# ✅ BEFORE COMPLETION

- Architecture followed 100%
- No lint/type errors
- MCP fully satisfied
- SEO optimized
- Fully tested

---

# 🧠 FINAL RULE

If unsure:
→ ASK
DO NOT assume
