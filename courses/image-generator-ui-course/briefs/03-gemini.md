# Module 3: Commissioning the Artist

**Output file:** `courses/image-generator-ui-course/modules/03-gemini.html`
**Section wrapper:** `<section class="module" id="module-3">`

## Teaching Arc

- **Metaphor:** **Commissioning an illustrator.** You don't press a "Charlie and Lola" button — there is no such button anywhere in the world. Someone wrote a paragraph of instructions describing exactly how the drawing should look, including a list of things it must *not* look like, and the app sends that paragraph plus your photo to a general-purpose artist every single time. The "style" you picked in the interface is a written brief, not a filter. (Exclusive to this module.)
- **Opening hook:** "Open the prompt box on the right of the generator and you can read the entire product. The whole 'Charlie & Lola style' is one paragraph of English, and you're allowed to edit it."
- **Key insight:** The intelligence in this app is rented, not built. The app's own contribution is: choosing a key, describing the style well, attaching the photo in the right shape, digging the picture back out of the reply, and putting it somewhere permanent. That's the job — and each of those five steps is a place things break.
- **"Why should I care?":** Three payoffs. (1) You learn that the biggest quality lever in an AI feature is the wording of the prompt, which you can change without touching any code. (2) You learn what a rate limit is and why apps pool keys — so you can reason about cost and capacity before you build. (3) You learn to check what the code actually calls rather than what the docs claim, because in this very repo the two disagree.

## The documentation trap (teach this — it's the module's best moment)

The project's own instructions file, `CLAUDE.md`, says in bold: *"The cyberpunk image generator requires a valid OpenAI API key to function"* and lists `OPENAI_API_KEY` as **REQUIRED**.

The code does not call OpenAI. It calls **Google Gemini** (`gemini-2.5-flash-image-preview`), reading `GEMINI_API_KEY` through `src/lib/gemini-api-pool.ts`. The endpoint is also still called `generate-cyberpunk` and there is a separate, unused Kling video SDK sitting in `src/aisdk/` (only a demo route at `src/app/api/demo/gen-image/route.ts` ever imports it).

Frame this generously — it's the completely normal residue of a project that got rebuilt while its documentation didn't. But make the lesson sharp: **an AI coding assistant reads `CLAUDE.md` and README files as gospel.** If you ask one to "fix the image generation," it may well go add OpenAI code to a Gemini app. The habit worth building is: *before trusting a doc, grep for what the code imports.*

## Code Snippets (pre-extracted — use VERBATIM, do not trim or reformat)

**File: `src/app/api/generate-cyberpunk/route.ts` (lines 121–129)** — the parcel handed to the model
```
    const imageEditPrompt = [
      { text: charlieLolaPrompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ];
```

**File: `src/app/api/generate-cyberpunk/route.ts` (lines 136–139)** — the actual AI call, all four lines of it
```
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: imageEditPrompt,
      });
```

**File: `src/app/api/generate-cyberpunk/route.ts` (lines 161–167)** — digging the picture out of the reply
```
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        generatedImageData = part.inlineData.data;
        generatedImageMimeType = part.inlineData.mimeType;
        break;
      }
    }
```

**File: `src/lib/gemini-api-pool.ts` (lines 49–59)** — the rotation
```
    // Try each key starting from current index
    for (let i = 0; i < this.apiKeys.length; i++) {
      const index = (this.currentIndex + i) % this.apiKeys.length;
      const keyStatus = this.apiKeys[index];

      if (keyStatus.isAvailable && keyStatus.requestCount < keyStatus.dailyLimit) {
        this.currentIndex = (index + 1) % this.apiKeys.length;
        keyStatus.lastUsed = new Date();
        keyStatus.requestCount++;
        return keyStatus.key;
      }
    }
```

**File: `src/app/api/generate-cyberpunk/route.ts` (lines 143–147)** — what happens when a key burns out
```
      // Check if it's a quota/limit error
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
        geminiApiPool.markKeyAsUnavailable(geminiApiKey, 'Quota exceeded');
        return respErr("Too many users online! VIP users get priority access. You're in queue, please wait a moment or upgrade to VIP for instant access.", 'QUEUE_REQUIRED');
      }
```

**File: `src/app/api/generate-cyberpunk/route.ts` (lines 182–186)** — the graceful fallback
```
    const hasStorageConfig = process.env.STORAGE_ENDPOINT && 
                            process.env.STORAGE_ACCESS_KEY && 
                            process.env.STORAGE_SECRET_KEY && 
                            process.env.STORAGE_BUCKET;
```
> Teaching note: if storage isn't configured, `finalImageUrl` stays as the giant `data:image/png;base64,...` string from line 178 and the app still works — the picture just travels inside the response instead of living at a web address. A feature that degrades instead of crashing. Worth a callout.

**The prompt itself** — quote it as prose in a callout or blockquote (it is one very long line in the source, `route.ts` line 94, so don't force it into a code block if it looks bad). Key parts to show: *"thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm"* … *"Retain the subject's original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression"* … *"Negative Prompt: No realistic shading, no detailed rendering, no anime or manga style, no 3D modeling, no photographic textures!"*
Teach the three-part shape of a good image brief: **what to make** / **what to preserve** / **what to forbid** (the negative prompt). That structure transfers to any image model.

## Interactive Elements (all required)

- **Data flow animation** (hero visual — `references/interactive-elements.md` → "Message Flow / Data Flow Animation"). Actors: `Request` → `Key Pool (6 slots)` → `Gemini` → `R2 Storage` → `Response`. Steps:
  1. Request arrives. Pool checks: does *any* key have life left? (`hasAvailableKeys()`)
  2. Pool hands out key #3 — the next one in the circle — and immediately advances the pointer to #4, so the next request gets a different key.
  3. The photo (base64) and the style brief travel to Gemini as one bundle.
  4. Gemini answers with `candidates` — a list of parts, some text, one containing the new picture.
  5. Server loops through the parts, grabs the first one with `inlineData`, throws the rest away.
  6. Picture is uploaded to R2 storage and becomes a normal web address.
  7. Alternate ending: Gemini answers **429 Too Many Requests** → key #3 is marked burnt and skipped by every future request → the user sees the queue message.
- **Code ↔ English translation** — at minimum `imageEditPrompt` + `generateContent`, and the key rotation loop. For the rotation loop explain the `%` (modulo) as "a clock face — when you run past the last key, you wrap around to the first."
- **Quiz** — 3–4 questions, decision/debugging style. Suggested angles:
  1. Every user suddenly sees "Too many users online!" but your Gemini dashboard shows plenty of quota left. What's the most likely cause? (Answer: keys got marked unavailable in memory and nothing ever un-marks them — `markKeyAsAvailable` and `resetDailyLimits` exist but nothing calls them on a schedule. Also: the pool lives in one server's memory, so a restart is the accidental cure.)
  2. You want output that keeps people's glasses instead of dropping them. Cheapest place to fix it? (Answer: the prompt paragraph — add it to the "retain" list. No deploy of new logic, no model change.)
  3. You ask an AI assistant to "add support for the new OpenAI image model, matching how we do it today." What should you say first? (Answer: correct the premise — the app uses Gemini, `CLAUDE.md` is stale; point it at `route.ts` and the pool.)
  4. Optional: a request returns 200 but "No image data found in Gemini API response." What does that tell you about where the failure was? (Answer: the call succeeded and the model replied — it just replied with text, e.g. a safety refusal. Not a network or key problem.)
- **Callout boxes** — at least two: (a) *aha!*: "Rate limits are a nightclub capacity, not a fine — the API doesn't charge you more, it stops letting you in." (b) *the pool is memory, not a database*: on a platform that runs several server copies, each copy has its own private pool and its own idea of which keys are burnt.
- **Optional extra:** pattern cards for the five jobs the app does around the model (choose a key / write the brief / attach the photo / dig out the reply / store it), or config badges for the environment variables (`GEMINI_API_KEY`…`GEMINI_API_KEY_5`, `STORAGE_*`).
- **Glossary tooltips** (first use): prompt, negative prompt, model, token, rate limit, quota, HTTP 429, round-robin, modulo, singleton, in-memory, candidates, `inlineData`, MIME type, fallback, environment variable, SDK, endpoint.

## Reference Files to Read

- `references/content-philosophy.md` — all of it
- `references/gotchas.md` — all of it
- `references/interactive-elements.md` → "Message Flow / Data Flow Animation", "Code ↔ English Translation Blocks", "Multiple-Choice Quizzes", "Callout Boxes", "Pattern/Feature Cards", "Permission/Config Badges", "Glossary Tooltips"
- `references/design-system.md` → "Module Structure", "Syntax Highlighting (Catppuccin-inspired)"

## Connections

- **Previous module:** *Front of House, Backstage* — established that the route and the key pool live on the server and the API key never crosses to the browser. Open by stepping through the door it left open.
- **Next module:** *The LEGO Box* — how the interface around all this is built: colour tokens, Tailwind, and the Shadcn components the generator's panels are made of. Tease: "The engine is rented. The interface is entirely the app's own — and it's built out of about thirty reusable bricks."
- **Tone/style notes:** Accent colour is teal. Keep actor names consistent with module 2 (`ImagenClient`, the route, the key pool). Be generous, not sneering, about the doc/code mismatch — the point is a habit, not a gotcha. Don't repeat module 1's photo-lab metaphor or module 2's theatre.
