# Module 7: When It Breaks — Debugging, Shipping, and the Whole Picture

> You are writing the FINAL module of a 7-module course about a real, live web app.
> The app: **charlieandlola.net** — upload a selfie, get a Charlie & Lola cartoon character
> from Google's Gemini AI. Free to try, sign in to download, buy credits for more.
> Next.js 15 + TypeScript, PostgreSQL, Stripe, Google Gemini, Cloudflare R2, two languages.
> This module has two jobs: build debugging intuition, and send the learner off with the whole
> architecture in one picture.

### Teaching Arc

- **Metaphor:** **Aviation.** Two halves, one world. Before every flight there's a **pre-flight
  checklist** — the same items, every time, read aloud, because "I'm sure it's fine" is how planes
  crash. That's deployment. And when something *does* go wrong, investigators don't guess; they
  pull the **flight recorder** and read what the aircraft was actually doing, second by second.
  That's logging and debugging. Use checklist / flight recorder / instruments throughout. Note the
  key aviation idea explicitly: you don't debug by *thinking harder*, you debug by *getting more
  instrument readings*.
- **Opening hook:** "Six modules of how it works. Here's the part nobody writes down: what to do at
  11pm when a user emails 'it's broken' and you have no idea where to start."
- **Key insight:** Debugging is **binary search on a pipeline**. You know the message travels
  Browser → Server → outside service → Database → back. Every observation cuts the search space in
  half. The goal of any debugging session is never "fix it" — it's "find the first step where
  reality stopped matching expectation."
- **"Why should I care?":** This is the single most valuable module for someone who directs AI.
  AI assistants are excellent at fixing a problem you can *describe precisely* and terrible at
  finding one you can only describe as "it doesn't work". A vague report sends AI into a loop of
  speculative rewrites, each one making the codebase worse. One precise sentence — *"the POST to
  /api/generate-cyberpunk returns 200 with code -1 and message 'Insufficient credits' even though
  the balance shows 40"* — usually gets fixed on the first try.

### Half One: When It Breaks

**The five-question ladder** (the module's central visual — numbered step cards or a flow diagram).
For any bug, ask in this order:
1. **Did the request even leave the browser?** (Browser dev tools → Network tab. No request = the
   bug is in your click handler, not on the server.)
2. **Did the server receive it, and what did it answer?** (Status code + the response body. This
   app always replies `{ code, message, data }` — `code: 0` is fine, `code: -1` is an error with a
   human-readable message right there.)
3. **Did an outside service refuse?** (Gemini quota, Stripe signature, storage credentials. These
   show up in server logs, not in the browser.)
4. **Is the data actually what you think it is?** (Is the credits row there? Is the order status
   still `created`?)
5. **Is it the environment, not the code?** (Works locally, fails in production ⇒ suspect
   environment variables first, every time. Module 3's GitHub-sign-in-button example is exactly
   this.)

**Three real bug shapes from this exact codebase.** Present these as cards or a spot-the-bug —
they're concrete, they're true, and each teaches a different instinct:

- **The silent zero.** `getUserCredits()` wraps everything in a `try/catch`, and on *any* failure
  it logs a line and returns a balance of **zero**. So if the database is unreachable, a paying
  customer doesn't see "something went wrong" — they see "0 credits" and assume they've been
  robbed. Lesson: **a catch block that swallows an error turns a loud problem into a quiet lie.**
  When you ask AI to "add error handling", say what should happen on failure, or you'll get this.
- **The environment gap.** A feature that works on a laptop and not in production is nearly always
  a missing environment variable, not broken code. In this app whole sign-in providers, the entire
  storage upload, and the payment provider choice are all switched on and off by env vars.
- **The name that lies.** The image endpoint is still called `/api/generate-cyberpunk` from a
  previous version of the product (Module 1 flagged this). There are also `.backup` copies of route
  files sitting in the repo. Lesson: in a real codebase, names and leftovers drift. Describe
  *behaviour* to an AI, not filenames.

**Reading the flight recorder.** The generation route logs a block of context before every AI call —
mode, model, aspect ratio, whether the user was registered, their uuid. Show it: this is somebody
deliberately deciding what they'd want to know at 3am. Teach the principle: **log the inputs you'd
need to reproduce the problem**, and never log secrets.

**The 60-second cliff.** `vercel.json` gives API endpoints a hard 60-second limit. Image generation
takes ~10 seconds, so there's headroom — but this is exactly the kind of invisible ceiling that
makes a feature work in testing and fail under load. Name the class of problem: *limits you didn't
choose and can't see*.

### Half Two: Getting It Onto the Internet

**Three ways to ship the same app** — cards, with the trade-off named for each:
- **Vercel** — the default. Push to git, it builds and deploys. Easiest; you're on their terms.
- **Cloudflare Workers** — a separate branch, runs at the edge, needs a special database
  connection (Hyperdrive) because the environment is more restricted. Cheap and fast; more
  constraints. The database file literally has a branch for it: `if (isCloudflareWorker)` opens
  exactly one connection instead of a pool.
- **Docker** — a recipe that builds a self-contained box you can run anywhere. Most portable;
  most work.

**The build step.** Worth one clear screen: the code you write is not the code that runs. `pnpm build`
turns TypeScript into JavaScript, pre-renders pages, and bundles everything. `output: "standalone"`
in the config means "produce one folder that contains everything needed to run" — which is what
makes the Docker image small. Note the multi-stage Dockerfile: install → build → copy only the
result into a fresh image, and run as a non-root user (`USER nextjs`) so a compromise can't take
the whole machine.

**The checklist.** Give the learner an actual pre-flight checklist they can reuse for any project:
environment variables set in production? database reachable *from production*, not just locally?
webhook URL registered with the payment provider and pointing at the live domain? secrets not in
the code? external service quotas high enough for launch day? a way to see the logs?

### Half Three: The Whole Picture (close the course here)

One full architecture diagram tying all seven modules together, then a short send-off. The diagram
should show: Browser (React components, `ui/` + `blocks/`) → Middleware (language) → Pages & API
Routes → Services (business rules) → Models → PostgreSQL; with Auth, Stripe, Gemini and R2 hanging
off the side as outside services. Label each region with the module that covered it.

Then a genuinely useful closing list: **the vocabulary you now own** — request/response, endpoint,
session, token, webhook, idempotent, ledger, schema, migration, connection pool, rate limit,
environment variable, graceful degradation, locale, component, server vs client, variant, middleware.
Frame it exactly as the payoff promised: these are the words that let you tell an AI assistant
precisely what you want.

### Code Snippets (pre-extracted — use verbatim, do not edit)

**Snippet A — the silent zero.** The most teachable seven lines in the codebase.
File: `src/services/credit.ts` (lines 65–77)

```ts
    if (user_credits.left_credits < 0) {
      user_credits.left_credits = 0;
    }

    if (user_credits.left_credits > 0) {
      user_credits.is_pro = true;
    }

    return user_credits;
  } catch (e) {
    console.log("get user credits failed: ", e);
    return user_credits;
  }
```

The `user_credits` returned from the catch block is the one initialised at the top of the function
with all zeros. A database outage and "you have no credits" look identical to the user.

**Snippet B — deliberately logging the context you'd want at 3am.**
File: `src/app/api/generate-cyberpunk/route.ts` (lines 95–105)

```ts
    console.log("=== Charlie and Lola API Request Details ===");
    console.log("Mode:", mode);
    console.log("Model:", model);
    console.log("Aspect Ratio:", aspectRatio);
    console.log("Output Format:", outputFormat);
    console.log("Style:", style);
    console.log("Custom Prompt:", customPrompt ? "Yes" : "No");
    console.log("Images uploaded:", images.length);
    console.log("User Registered:", isRegisteredUser);
    console.log("User UUID:", userUuid || "Guest user");
    console.log("===========================================");
```

**Snippet C — the invisible ceiling.**
File: `vercel.json` (whole file)

```json
{
  "functions": {
    "app/api/**/*": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

**Snippet D — the same code, two environments.**
File: `src/db/index.ts` (lines 55–67)

```ts
  // In Cloudflare Workers, create new connection each time
  if (isCloudflareWorker) {
    console.log("in Cloudflare Workers environment");
    // Workers environment uses minimal configuration
    const client = postgres(databaseUrl, {
      prepare: false,
      max: 1, // Limit to 1 connection in Workers
      idle_timeout: 10, // Shorter timeout for Workers
      connect_timeout: 5,
    });

    return drizzle(client);
  }
```

**Snippet E — building a shippable box, and dropping privileges.**
File: `Dockerfile` (lines 22–33)

```dockerfile
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
```

### Interactive Elements (all required)

- [x] **Code↔English translation** — at least three: Snippet A (the silent zero — translate the
      catch block into what the *user* experiences), Snippet C (the invisible ceiling), and
      Snippet D or E.
- [x] **Interactive architecture diagram** — the whole-app picture described above. This is the
      module's hero visual and the course's closing image. Label regions with module numbers.
- [x] **Data flow animation** — a *debugging* flow rather than a success flow: walk the five-question
      ladder as a pipeline with a red X appearing at a different stage each step, showing what you'd
      observe at each point. (Or: animate one concrete bug — "user says image never appears" — being
      narrowed down step by step.)
- [x] **Spot the Bug challenge** — Snippet A. Show it, ask what a user experiences when the database
      is down, then reveal.
- [x] **Quiz** — 4–5 questions, all scenario/debugging. This is the course's final quiz, so make it
      a genuine test of everything:
      1. "A customer says they paid but have no credits. Walk the ladder: what do you check, in what
         order?" (Correct answer should involve: did Stripe send the webhook / did it verify / is
         the order status `paid` / is there a credits row for that order number.)
      2. "Everything works locally; in production sign-in with GitHub does nothing. Best first
         guess?" (Correct: missing environment variables in production.)
      3. "An AI assistant offers to 'add error handling' to a data-fetching function. What should
         you specify?" (Correct: what should happen on failure — surface the error, don't return a
         default that looks like real data.)
      4. "You want to add a feature where users can save favourites. Based on the whole course,
         name the layers you'd expect to change." (Correct: a new table + migration, a model, a
         service, an API route, a component — and translation strings for both languages.) This is
         the capstone question; the explanation should walk the full stack.
      5. "The generation feature starts timing out only during a traffic spike. Name two suspects
         you now know about." (Correct: the 60-second function limit and the exhausted Gemini API
         key pool.)
- [x] **Glossary tooltips** — aggressive. At minimum: debugging, dev tools, Network tab, status
      code, log, stack trace, `try/catch`, exception, environment variable, production vs
      development, deploy, build, bundle, Vercel, Cloudflare Workers, edge, Docker, container,
      image (Docker sense), multi-stage build, root user, timeout, memory limit, branch, git,
      binary search, reproduce.
- [x] **Callout boxes** — one "aha" on *debugging is binary search, not inspiration*; one warning on
      *a catch block that swallows errors turns a loud problem into a quiet lie*; one closing note
      on *works locally ≠ works in production, and the difference is almost always configuration*.

### Screens (aim for 6)

1. **The flight recorder** — metaphor; you don't think harder, you get more readings.
2. **The five-question ladder** — step cards + the debugging flow animation. Hero visual #1.
3. **Three bugs from this codebase** — the silent zero (Snippet A + spot-the-bug), the environment
   gap, the name that lies.
4. **What to log** — Snippet B, plus never log secrets. Snippet C and the invisible ceiling.
5. **Getting it onto the internet** — three deployment routes as cards, Snippets D and E, the build
   step, and the reusable pre-flight checklist.
6. **The whole picture** — the architecture diagram, the vocabulary list, the final quiz, and a
   warm two-sentence send-off. Do not end on the quiz alone; end on encouragement.

### Reference Files to Read

- `references/content-philosophy.md` — all of it.
- `references/gotchas.md` — all of it.
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Multiple-Choice
  Quizzes", "Interactive Architecture Diagram", "Message Flow / Data Flow Animation", "Spot the Bug
  Challenge", "Callout Boxes", "Glossary Tooltips", "Numbered Step Cards", "Pattern/Feature Cards",
  "Permission/Config Badges".
- `references/design-system.md` → "Module Structure", "Color Palette", "Typography".

### Connections

- **Previous module: "Every Language, Every Screen"** — middleware routing by language, interface
  labels vs page content in JSON data files, the English fallback, Tailwind + the 37 reusable `ui/`
  parts + `blocks/`, button variants, and the one-file colour palette. It ended by saying the last
  module is *what to do when it doesn't work*, and how all of this gets from a laptop onto the real
  internet. Open on that.
- **Next module:** none — this is the finale. Recap the whole course and send the learner off.
- **What the other six modules covered, for the recap:**
  1. *What Happens When You Click Generate* — request/response, the API route, the AI prompt.
  2. *Meet the Cast* — folder map, the Route → Service → Model → Database layer rule, server vs client.
  3. *Who Are You?* — OAuth, sessions, tokens, hashed passwords, 30 free credits on signup.
  4. *Following the Money* — Stripe checkout, webhooks, idempotency, the append-only credits ledger.
  5. *Memory and the Outside World* — the eight tables, schema & migrations, connection pooling, the
     Gemini key pool, graceful degradation, and two real gotchas (a deleted Supabase database, a
     hardcoded password).
  6. *Every Language, Every Screen* — middleware, locales, content as data, the design system.
- **Tone/style notes:** Accent colour is **vermillion** (warm red-orange). Warm developer-notebook
  feel. Zero jargon without a tooltip. Second person. The learner is a "vibe coder" — builds
  software by instructing AI, no CS background. **Never use a restaurant/kitchen metaphor.**
  Already used elsewhere and off-limits here: photo lab (M1), film production (M2), festival
  wristband (M3), chequebook register (M4), blueprints-and-permits (M5), museum audio guide (M6).
  Actor naming across the course: **Browser, Server, Gemini, Database, Stripe, Storage** —
  capitalised, consistent. Be generous and encouraging at the close: the learner has just read a
  real production codebase end to end, which is genuinely hard.
  Your file must contain ONLY `<section class="module" id="module-7"> ... </section>` — no
  `<html>`, `<head>`, `<body>`, `<style>` or `<script>` tags. Write it to
  `courses/general-course/modules/07-when-it-breaks.html`.
