# Module 5: Memory and the Outside World

> You are writing ONE module of a 7-module course about a real, live web app.
> The app: **charlieandlola.net** — upload a selfie, get a Charlie & Lola cartoon character
> from Google's Gemini AI. Free to try, sign in to download, buy credits for more.
> Next.js 15 + TypeScript. Data lives in a PostgreSQL database (hosted on Supabase),
> images live in Cloudflare R2 object storage, the AI comes from Google.

### Teaching Arc

- **Metaphor:** **Building blueprints and renovation permits.** `schema.ts` is the blueprint — it
  says this building has a Users room with these dimensions, an Orders room with those. But you
  can't just hand a builder a new blueprint for a building people are already living in. You issue
  numbered, dated **permits**: *#0003 — add a category column to Posts. #0004 — add a password_hash
  column to Users.* Applied in order, they take any building from empty lot to current state. That's
  a **migration**. Anyone with the permit stack can rebuild the exact same building.
  Secondary metaphor, kept separate and small: the API key pool as **a bank of phone lines** — when
  one line is engaged, the switchboard rotates to the next.
- **Opening hook:** "Every module so far has said 'and then it saves it to the database' as if that
  were one word. It's about six ideas — and the most useful thing about this particular database is
  that, when we went looking for it while making this course, **it was gone**."
- **Key insight:** Your app's data lives on *someone else's computer*, and so do the AI, the image
  storage, and the payments. Your app is mostly a **coordinator of services it doesn't control**.
  Every one of those services can be slow, rate-limited, expensive, or simply deleted.
- **"Why should I care?":** Three practical superpowers. (1) You'll recognise a schema change as a
  schema change, and know to ask AI for a *migration* rather than letting it silently edit tables.
  (2) You'll know that "the app is broken" often means "an external service said no", and you'll
  check that first. (3) You'll spot the cost and rate-limit questions *before* you launch, not after
  the bill arrives.

### The Database Half

**Tables in this app (all 8, real).** Present as cards or an annotated list — this is a great
visual and it summarises the whole product:

| Table | What it holds |
|---|---|
| `users` | one row per account: uuid, email, nickname, avatar, which provider they signed in with, invite code |
| `orders` | one row per purchase attempt: order number, amount, status, Stripe session id, credits bought |
| `credits` | the ledger from Module 4: one row per grant or spend |
| `apikeys` | developer keys (the ones starting `sk-`) |
| `posts` | blog articles |
| `categories` | blog categories |
| `affiliates` | referral rewards |
| `feedbacks` | user feedback and ratings |

**The schema is TypeScript, not SQL.** Worth its own screen: developers describe the tables in a
normal code file, and a tool called **Drizzle** generates the actual database instructions. The
payoff is that the *editor* then knows the shape of your data — misspell `left_credits` and you're
told immediately, before the code ever runs.

**Migrations.** There are five in `src/db/migrations/`, with names auto-generated from a word list
(`0003_steady_toad.sql`, `0004_striped_colossus.sql`). They're plain, tiny, and readable — show
0004, it's literally one line. The lesson: a schema change is a *file you can review*, not an
invisible act.

**Connection pooling.** Opening a connection to a database is slow, so the app opens a handful and
reuses them (`max: 10`). In Cloudflare's environment it opens exactly one, because that environment
charges differently. Metaphor-adjacent framing: it's a small set of open phone lines held ready,
not a new call placed every time anyone asks a question.

### The Two Real Gotchas (both true, both from this codebase — this is the best material here)

**Gotcha 1 — the database vanished.** This app's `DATABASE_URL` points at a Supabase-hosted
Postgres database. While building this course we tried to connect to it and got **"tenant or user
not found"** — the project had been deleted, most likely purged as an inactive free-tier project.
Nothing in the code is wrong. The code is fine. The *thing the code depends on* stopped existing.
Teach the debugging shape of this: an error that says "not found" at the *connection* stage, before
any of your queries run, is almost never your code — it's the address, the credentials, or the
service itself. Two things that would have caught it earlier: a health check that actually touches
the database, and knowing that free tiers reclaim idle projects.

**Gotcha 2 — the hardcoded password.** `src/db/index.ts` contains a real database password written
directly into the source code, as a patch for a `/` character breaking URL parsing. Show it
**with the password masked** (write `[REDACTED]` where the password is, and tell the reader you've
masked it — the real file does not). Two lessons, both valuable:
  - Secrets belong in environment variables, never in code. Code gets committed, shared, screenshotted.
  - The *actual* fix for "my password has a special character in it" is URL-encoding the value in
    the environment variable — not a string-replace on one specific password inside the app.
  This is exactly the kind of well-intentioned "just make it work" patch an AI assistant will write
  when you say "the database URL is failing" — and exactly the kind you should catch.

### The Outside World Half

**Three outside services, three different failure modes.** Cards:
- **Google Gemini** — the AI. Fails with *quota exceeded* (HTTP 429) when you've used too much.
- **Cloudflare R2** — object storage for finished images. Fails by being unreachable.
- **Stripe** — payments (Module 4).

**The API key pool** is a lovely, teachable pattern. The app reads up to six Gemini keys from
environment variables, hands them out in rotation, counts requests against a daily limit, and
**benches a key that errors** so the next request tries a different one. When every key is benched,
the user gets an honest "we're at capacity" message rather than a crash. Point out the deliberate
product decision inside the error handling: a quota failure is turned into *"Too many users online!
VIP users get priority access"* — a technical limit reframed as an upsell.

**Graceful degradation.** If storage isn't configured or the upload fails, the app doesn't error —
it falls back to sending the whole image back inside the reply as a giant text string (a base64
data URL). Worse, but working. Name the pattern: **graceful degradation**, and note the trade-off
(the reply gets megabytes bigger and the image isn't saved anywhere).

### Code Snippets (pre-extracted — use verbatim, do not edit, EXCEPT the masking noted in Snippet C)

**Snippet A — a table described in TypeScript.**
File: `src/db/schema.ts` (lines 82–91)

```ts
export const credits = pgTable("credits", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  trans_no: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp({ withTimezone: true }),
  user_uuid: varchar({ length: 255 }).notNull(),
  trans_type: varchar({ length: 50 }).notNull(),
  credits: integer().notNull(),
  order_no: varchar({ length: 255 }),
  expired_at: timestamp({ withTimezone: true }),
});
```

**Snippet B — an entire migration.** Show it as a one-liner; the brevity IS the point.
File: `src/db/migrations/0004_striped_colossus.sql` (whole file)

```sql
ALTER TABLE "users" ADD COLUMN "password_hash" varchar(255);
```

**Snippet C — the hardcoded-password patch. MASK THE PASSWORD.**
File: `src/db/index.ts` (lines 34–39) — *password replaced with `[REDACTED]` for this course; the
real file has it in plain text.*

```ts
  // Apply URL encoding for the specific password issue we're seeing
  if (databaseUrl.includes(':[REDACTED]@')) {
    databaseUrl = databaseUrl.replace(':[REDACTED]@', ':[REDACTED-ENCODED]@');
    console.log('Applied URL encoding for database password special character');
  }
```

State plainly in the surrounding text that you have masked the password and that the real file
contains it verbatim — that honesty is part of the lesson.

**Snippet D — a handful of connections, reused.**
File: `src/db/index.ts` (lines 74–83)

```ts
  // Node.js environment with connection pool configuration
  const client = postgres(databaseUrl, {
    prepare: false,
    max: 10, // Maximum connections in pool
    idle_timeout: 30, // Idle connection timeout (seconds)
    connect_timeout: 10, // Connection timeout (seconds)
  });
  dbInstance = drizzle({ client });

  return dbInstance;
```

**Snippet E — six keys, taken in rotation.**
File: `src/lib/gemini-api-pool.ts` (lines 19–27)

```ts
    // Get all Gemini API keys from environment variables
    const geminiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2, 
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5,
    ].filter(key => key && key.trim() !== '');
```

**Snippet F — benching a key that just failed, and turning a limit into an upsell.**
File: `src/app/api/generate-cyberpunk/route.ts` (lines 143–147)

```ts
      // Check if it's a quota/limit error
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
        geminiApiPool.markKeyAsUnavailable(geminiApiKey, 'Quota exceeded');
        return respErr("Too many users online! VIP users get priority access. You're in queue, please wait a moment or upgrade to VIP for instant access.", 'QUEUE_REQUIRED');
      }
```

**Snippet G — graceful degradation: no storage? send the image inline.**
File: `src/app/api/generate-cyberpunk/route.ts` (lines 178–186)

```ts
    let finalImageUrl = `data:${generatedImageMimeType};base64,${generatedImageData}`;
    let storedFilename = filename;

    // Store image if storage is configured
    const hasStorageConfig = process.env.STORAGE_ENDPOINT && 
                            process.env.STORAGE_ACCESS_KEY && 
                            process.env.STORAGE_SECRET_KEY && 
                            process.env.STORAGE_BUCKET;
```

### Interactive Elements (all required)

- [x] **Code↔English translation** — at least three: Snippet A (a table in TypeScript), Snippet E
      or F (the key pool), and Snippet C (the masked password patch — translate it into English
      including *why this is the wrong fix*).
- [x] **Data flow animation** — the hero visual: the API key pool in action. Actors:
      `Request 1` … `Request 4` and `Key A`, `Key B`, `Key C`. Steps: Request 1 → Key A. Request 2 →
      Key B (rotation). Request 3 → Key C. Key C returns "429 quota exceeded" → Key C is benched.
      Request 4 → skips C, goes to Key A. When all keys are benched → user sees "at capacity".
- [x] **Spot the Bug challenge** — Snippet C is the perfect candidate. Ask the learner what's wrong
      with it before revealing (a live password in source code; and the real fix is URL-encoding
      the environment variable, not a hardcoded string replace).
- [x] **Quiz** — 4 questions, scenario/debugging style:
      1. "Your app suddenly returns errors on every page, and the log says 'tenant or user not
         found' before any query runs. What's the most likely cause?" (Correct: the database itself
         is gone/unreachable or the connection string is wrong — not your application code.
         Real story from this codebase.)
      2. "You ask an AI to 'add a phone number field to users'. What should you insist it produces
         alongside the schema change?" (Correct: a migration file, so the change is reviewable and
         repeatable on every environment.)
      3. "Image generation works for the first few users each morning and then everyone gets
         'we're at capacity'. What's the likely cause and what's one lever you could pull?"
         (Correct: daily quota on the AI keys is exhausted — add more keys / raise the paid quota /
         queue requests.)
      4. "Storage credentials are missing in production. What does a user actually experience?"
         (Correct: generation still works, but the image comes back embedded in the response and
         isn't saved anywhere — slower and unsharable. Teaches graceful degradation.)
- [x] **Glossary tooltips** — aggressive. At minimum: database, PostgreSQL, table, row, column,
      schema, migration, SQL, ORM, Drizzle, Supabase, connection pool, query, primary key, index,
      timestamp, environment variable, API key, rate limit, quota, HTTP 429, object storage,
      Cloudflare R2, base64, data URL, free tier, credentials, hardcode, graceful degradation, uuid.
- [x] **Callout boxes** — one "aha" on *your app is mostly a coordinator of services you don't
      control*; one warning on *secrets never go in code*; one on *free tiers reclaim idle projects*.

### Screens (aim for 6)

1. **Blueprints and permits** — the metaphor; what a database actually is in one sentence.
2. **The eight tables** — annotated cards. Snippet A as a code↔English block.
3. **Permits** — Snippet B (the one-line migration), why migrations exist, what to ask AI for.
4. **The day the database vanished** — the true story, the debugging shape of connection-stage
   errors, plus Snippet D (pooling) as the "how it normally connects" grounding.
5. **The password in the code** — Snippet C, spot-the-bug, the secrets callout.
6. **The outside world** — the three services, the key pool animation, Snippets E/F/G, graceful
   degradation, then the quiz.

### Reference Files to Read

- `references/content-philosophy.md` — all of it.
- `references/gotchas.md` — all of it.
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Multiple-Choice
  Quizzes", "Message Flow / Data Flow Animation", "Spot the Bug Challenge", "Callout Boxes",
  "Glossary Tooltips", "Pattern/Feature Cards", "Visual File Tree", "Icon-Label Rows".
- `references/design-system.md` → "Module Structure", "Color Palette", "Typography".

### Connections

- **Previous module: "Following the Money"** — Stripe checkout, webhooks, idempotency, and the
  append-only credits ledger. It ended by saying "we've written a lot of rows to a database without
  asking what a database actually is, or what happens when it disappears — it disappeared, really."
  Open by delivering on that hook.
- **Next module: "Every Language, Every Screen"** — how the same app serves English and Chinese,
  and how the interface is assembled from reusable pieces. End by pointing forward: every piece of
  text the learner has seen quoted in error messages so far was in English — but this app runs in
  two languages, and none of that text lives in the components.
- **Tone/style notes:** Accent colour is **vermillion** (warm red-orange). Warm developer-notebook
  feel. Zero jargon without a tooltip. Second person. The learner is a "vibe coder" — builds
  software by instructing AI, no CS background. **Never use a restaurant/kitchen metaphor.**
  Already used elsewhere and off-limits here: photo lab (M1), film production (M2), festival
  wristband (M3), chequebook register (M4). Actor naming across the course: **Browser, Server,
  Gemini, Database, Stripe, Storage** — capitalised, consistent. Be matter-of-fact and kind about
  the two gotchas — the goal is "this is normal and here's how you catch it", never mockery of
  whoever wrote it.
  Your file must contain ONLY `<section class="module" id="module-5"> ... </section>` — no
  `<html>`, `<head>`, `<body>`, `<style>` or `<script>` tags. Write it to
  `courses/general-course/modules/05-memory-and-the-outside-world.html`.
