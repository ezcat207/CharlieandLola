# Module 1: What Happens When You Click "Generate"

> You are writing ONE module of a 7-module course about a real, live web app.
> The app: **charlieandlola.net** — you upload a selfie, it turns it into a Charlie & Lola
> children's-cartoon-style character using Google's Gemini AI. It's a real business:
> free to try, sign in to download, buy credits for more.
> Repo name in package.json: `charlie-and-lola-style-converter`, version 2.6.0.

### Teaching Arc

- **Metaphor:** **The one-hour photo lab drop-off envelope.** You slide your film into a paper
  envelope, write your name and "matte finish, 4x6" on the outside, and post it through a slot
  in the wall. You cannot see what happens back there. Someone develops it, someone files a copy,
  and later an envelope of prints comes back out. The *envelope with the options written on it*
  is the request. The slot in the wall is the API endpoint. The lab out back is the server.
  Use this metaphor throughout — the "envelope", the "slot", the "back room", the "prints".
- **Opening hook:** "You pick a photo of yourself, hit Generate, watch a spinner for about ten
  seconds, and a cartoon version of you appears. Those ten seconds are the whole course in
  miniature. Let's slow them down."
- **Key insight:** Your browser and the server are two separate computers that can only pass
  each other **messages**. Everything an app does is: package a message, send it, wait, unpack
  the reply. The "magic" is just a very well-organized relay of messages.
- **"Why should I care?":** When something in your app doesn't work, the very first useful
  question is *"how far did the message get?"* Did it leave the browser? Did the server receive
  it? Did the AI company answer? Being able to point at a step is the difference between
  "it's broken, fix it" (which sends AI in circles) and "the request reaches the server but the
  reply has no image in it" (which gets it fixed in one shot).

### The Actual 7 Steps (this is the spine of the module)

1. **You drop a photo in.** The browser turns the file into a long text string (base64) and keeps
   it in memory + `localStorage`.
2. **You click Generate.** The browser packs a `FormData` envelope: the image plus the options
   (style, aspect ratio, output format).
3. **`fetch('/api/generate-cyberpunk')`** — the envelope goes through the slot.
4. **The server unpacks and checks it.** Valid aspect ratio? Is there an image? Under 10MB? Are you
   signed in, and if so do you have ≥10 credits? Is an AI key free right now?
5. **The server calls Google Gemini** with the prompt + your image bytes, and waits.
6. **The reply comes back as raw image data.** The server uploads it to cloud storage (Cloudflare R2)
   and gets a URL. If storage isn't configured, it falls back to embedding the whole image in the reply.
7. **The server sends back one JSON object.** The browser reads `result.data.imageUrl`, sets it in
   React state, and the picture appears. A little toast pops up.

### Code Snippets (pre-extracted — use verbatim, do not edit)

**Snippet A — the browser packs the envelope.**
File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 334–357)

```js
      const formData = new FormData();

      formData.append('mode', 'image2image');
      formData.append('style', 'charlie-lola'); // Fixed style for Charlie and Lola
      formData.append('aspectRatio', aspectRatio);
      formData.append('outputFormat', outputFormat);
      formData.append('model', 'standard'); // Fixed model

      if (customPrompt.trim()) {
        formData.append('customPrompt', customPrompt);
      }

      for (let i = 0; i < uploadedImages.length; i++) {
        const response = await fetch(uploadedImages[i]);
        const blob = await response.blob();
        formData.append(`image_${i}`, blob);
      }

      formData.append('imageCount', uploadedImages.length.toString());

      const apiResponse = await fetch('/api/generate-cyberpunk', {
        method: 'POST',
        body: formData,
      });
```

**Snippet B — the server unpacks the envelope.**
File: `src/app/api/generate-cyberpunk/route.ts` (lines 9–18)

```ts
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const style = formData.get('style') as string || 'charlie-lola';
    const mode = formData.get('mode') as string || 'image2image'; // Charlie and Lola style transformation
    const customPrompt = formData.get('customPrompt') as string || '';
    const aspectRatio = formData.get('aspectRatio') as string || '4:3';
    const outputFormat = formData.get('outputFormat') as string || 'png';
    const model = formData.get('model') as string || 'standard';
    const imageCount = parseInt(formData.get('imageCount') as string || '0');
```

**Snippet C — the actual instruction sent to the AI (the prompt).**
File: `src/app/api/generate-cyberpunk/route.ts` (lines 121–139)

```ts
    const imageEditPrompt = [
      { text: charlieLolaPrompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ];

    console.log("🔄 Generating Charlie and Lola style image...");

    let response;
    try {
      // Generate edited image using Gemini 2.5 Flash Image Preview
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: imageEditPrompt,
      });
```

**Snippet D — the reply the browser gets back.**
File: `src/app/api/generate-cyberpunk/route.ts` (lines 236–250)

```ts
    return respData({
      imageUrl: responseImageUrl,
      filename: storedFilename,
      message: "Charlie and Lola style transformation completed successfully",
      provider: "google.gemini",
      model: "gemini-2.5-flash-image-preview",
      creditsUsed: isRegisteredUser ? requiredCredits : 0,
      aspectRatio,
      outputFormat: fileExtension,
      style: style,
      storedLocally: hasStorageConfig && !finalImageUrl.startsWith('data:'),
      requiresRegistration,
      isPreview: !isRegisteredUser,
      downloadUrl: isRegisteredUser ? responseImageUrl : null,
    });
```

**Snippet E — the browser unpacks the reply.**
File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 363–378)

```js
      const result = await apiResponse.json();

      if (result.code === 0 && result.data?.imageUrl) {
        setGeneratedImage(result.data.imageUrl);

        // Handle different response types
        if (result.data.requiresRegistration && !session) {
          toast.success("Image generated! Sign in to download full resolution image.");
        } else if (result.msg === 'QUEUE_REQUIRED') {
          toast.warning("🚧 Service is busy. You're in the queue. Upgrade to premium to skip the queue!");
        } else {
          toast.success(t.messages.success.generated);
          if (session) {
            refreshCredits();
          }
        }
```

### Facts You Can Use (all verified in the codebase)

- The endpoint is literally called **`/api/generate-cyberpunk`** even though the app makes
  Charlie & Lola cartoons. This is a leftover name from an earlier version of the product. It works
  fine — but it's a great, true, real-world example of how names in code drift away from what the
  code does. Worth an "aha" callout: *stale names are a normal fact of real codebases, and they're
  why you should describe behaviour, not filenames, when instructing an AI.*
- The AI model is `gemini-2.5-flash-image-preview` from Google.
- The prompt is a long, very specific English paragraph including a "Negative Prompt" section
  listing what NOT to do: *"No realistic shading, no detailed rendering, no anime or manga style,
  no 3D modeling, no photographic textures!"* — the prompt is just text in a file. Anyone who can
  edit that string can change the entire product. Good "aha" moment.
- Uploaded images are capped at 5, and each must be under 10MB.
- The reply is always shaped `{ code, message, data }` — `code: 0` means OK, `code: -1` means error.
  This is a house convention defined in `src/lib/resp.ts`, not a web standard.

### Interactive Elements (all required)

- [x] **Code↔English translation** — Snippet A (browser packs envelope) and Snippet D or E
      (the reply). At least two translation blocks in this module.
- [x] **Data flow animation** — THE hero visual of this module. Actors, in order:
      `Browser` → `API Route` → `Gemini AI` → `Cloud Storage` → `Browser`.
      Steps: (1) Browser packs photo + options into FormData. (2) POST to /api/generate-cyberpunk.
      (3) Server validates: aspect ratio, image present, size under 10MB, credits, free API key.
      (4) Server sends prompt + image bytes to Gemini. (5) Gemini returns raw image data.
      (6) Server uploads it to Cloudflare R2 and gets a URL back. (7) Server returns JSON with
      `imageUrl`. (8) Browser puts the URL in an `<img>` and shows a toast.
- [x] **Group chat animation** — a short one, three participants: **Browser**, **Server**,
      **Gemini**. Give them personality. Browser: "Here's a photo and some options, make it
      Charlie & Lola." Server: "Hold on — aspect ratio valid? image present? under 10MB? ok."
      Server → Gemini: "Turn this person into a Charlie & Lola character. No 3D, no anime, no
      photographic textures." Gemini: "...done, here's the raw pixels." Server: "Filing a copy in
      storage. Here's your URL." Browser: "🎉". (The course needs at least one group chat overall;
      Modules 1 and 4 both have one, which is good.)
- [x] **Quiz** — 3 questions at the end, all scenario/debugging style:
      1. A user says "I clicked Generate and nothing happened — the spinner just spins forever."
         Where do you look FIRST, and why? (Options: rewrite the AI prompt / check whether the
         request left the browser and what the server replied / change the button colour /
         reinstall the app.) Correct: check the message journey — open the browser's Network tab
         and see how far the envelope got.
      2. You want to change the cartoon style so characters keep a *background* instead of a
         transparent one. What actually has to change? (Correct: the prompt text — it's just an
         English string in the API route. Wrong options teach that you don't need a new AI model
         or a database change.)
      3. Guests see the generated image but the download button asks them to sign in. Based on
         the JSON reply, which field is the app checking? (Correct: `requiresRegistration` /
         `downloadUrl` being null for guests.)
- [x] **Glossary tooltips** — be aggressive. Tooltip at minimum: API, endpoint, request, response,
      server, client/browser, JSON, base64, FormData, `fetch`, POST, state, React, prompt,
      validate, MB, upload, URL, toast, cloud storage, model (AI sense), localStorage.
- [x] **Callout boxes** — one "aha" on *the whole internet is just request → response*, and one on
      *the endpoint name lies (generate-cyberpunk) — describe behaviour, not filenames, to AI*.

### Screens (aim for 5)

1. **What this app even is** — one short paragraph + an icon-label row or feature cards:
   upload a photo → get a cartoon; free to try; sign in to download; credits to keep going.
   Include what makes it *technically* interesting: it's a full commercial product — payments,
   accounts, two languages, an AI model — in about 330 TypeScript files.
2. **The photo lab metaphor** — set it up visually (numbered step cards or a flow diagram).
3. **The envelope** — Snippet A as a code↔English block. One idea: a request is data + options.
4. **The back room** — Snippet B, C. The prompt reveal. Then the flow animation as hero visual.
5. **The prints come back** — Snippet D/E, the group chat, then the quiz.

### Reference Files to Read

- `references/content-philosophy.md` — all of it.
- `references/gotchas.md` — all of it.
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Multiple-Choice
  Quizzes", "Group Chat Animation", "Message Flow / Data Flow Animation", "Callout Boxes",
  "Numbered Step Cards", "Glossary Tooltips", "Icon-Label Rows".
- `references/design-system.md` → "Module Structure", "Color Palette", "Typography".

### Connections

- **Previous module:** none — this is the opening. Open by explaining what the app does in plain
  language before anything technical.
- **Next module: "Meet the Cast"** — end by pointing forward: "We just watched a message travel
  through five different pieces of code without ever asking *who* those pieces are, or why the
  code is split up the way it is. That's next."
- **Tone/style notes:** Accent colour is **vermillion** (`--color-accent`, a warm red-orange).
  Warm developer-notebook feel. Zero jargon without a tooltip. Second person ("you"). Never say
  "as you probably know". The learner is a "vibe coder" — they build software by instructing AI,
  and have no CS background. Never use a restaurant/kitchen metaphor anywhere.
  Actor naming convention used across the whole course: **Browser**, **Server**, **Gemini**,
  **Database**, **Stripe**, **Storage** — capitalised, used consistently in every animation.
  Your file must contain ONLY `<section class="module" id="module-1"> ... </section>` — no
  `<html>`, `<head>`, `<body>`, `<style>` or `<script>` tags. Write it to
  `courses/general-course/modules/01-the-click.html`.
