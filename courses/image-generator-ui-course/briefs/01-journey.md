# Module 1: The Journey of One Photo

**Output file:** `courses/image-generator-ui-course/modules/01-journey.html`
**Section wrapper:** `<section class="module" id="module-1">`

## What the app is (context for the opening — explain this in plain English on screen 1)

The app is a website called **Charlie & Lola AI**. You drag a photo of yourself (or your dog, or a toy) onto the page, click **Generate**, wait a few seconds, and you get back the same subject redrawn in the scratchy, flat-colour, hand-drawn style of the British children's cartoon *Charlie and Lola*. Then you can download it or copy a share link.

That's the entire product. Everything in this course is about the machinery behind that one button — and about the visual building blocks the interface is made from.

Built with: Next.js 15 (a website framework), React, TypeScript, Tailwind CSS + Shadcn UI for looks, and Google's **Gemini** model for the actual drawing.

## Teaching Arc

- **Metaphor:** **The one-hour photo lab.** You hand your film over the counter, it disappears behind the wall into machines you never see, and twenty minutes later prints come back. You don't know what the machines do — but there IS a fixed sequence, and every failed photo has a specific station where it went wrong. This module walks the learner behind the counter for the first time. (Do NOT reuse this metaphor later — modules 2–5 have their own.)
- **Opening hook:** "You drop a photo onto the box and click Generate. For four seconds, nothing visible happens. Here's everything that happens in those four seconds."
- **Key insight:** A generation is not one magical event — it's a **relay of seven hand-offs** between separate pieces of software, three of which are not on your computer at all. Knowing the seven stations means that when something breaks you can name the station instead of saying "the AI is broken."
- **"Why should I care?":** When you tell an AI coding assistant "the image isn't showing up," you get a shotgun of guesses. When you say "the POST to /api/generate-cyberpunk returns fine but the preview stays empty," you get a fix. This module is where you learn to say the second thing.

## Screens (suggested — 5 screens)

1. **What this thing does** — the product in plain English + the two halves this course covers (the generator engine; the interface it lives in). Short.
2. **The seven stations** — the hero visual: the data flow animation, described below.
3. **Station 1–2: the photo never leaves the page (at first)** — `handleFileUpload`, FileReader, data URLs, and why the photo sits in the browser as text before it goes anywhere.
4. **Station 3: packing the parcel** — `generateImage()` building FormData and POSTing it.
5. **Station 6–7: the image comes back as text** — what the server sends back, and the quiz.

## Code Snippets (pre-extracted — use VERBATIM, do not trim or reformat)

**File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 281–294)**
```
  const handleFileUpload = (file: File) => {
    if (uploadedImages.length >= 5) {
      toast.error(t.upload.max_images_error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUploadedImages(prev => [...prev, imageData]);
      setGeneratedImage(null);
    };
    reader.readAsDataURL(file);
  };
```

**File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 334–357)**
```
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

**File: `src/app/api/generate-cyberpunk/route.ts` (lines 173–178)**
```
    // Generate filename and store the image
    const batch = getUuid();
    const fileExtension = generatedImageMimeType.split('/')[1];
    const filename = `charlie-lola-${batch}.${fileExtension}`;

    let finalImageUrl = `data:${generatedImageMimeType};base64,${generatedImageData}`;
```

**File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 363–367)**
```
      const result = await apiResponse.json();

      if (result.code === 0 && result.data?.imageUrl) {
        setGeneratedImage(result.data.imageUrl);

```

## Interactive Elements (all required)

- **Data flow animation** (this module's hero visual — `references/interactive-elements.md` → "Message Flow / Data Flow Animation"). Actors, left to right:
  `You (the browser)` → `ImagenClient (the page's code)` → `/api/generate-cyberpunk (the server)` → `Google Gemini` → `Cloudflare R2 (file storage)`
  Steps (7):
  1. You drop a photo onto the dashed box — the browser reads the file into a long text string (a *data URL*). Nothing has left your computer yet.
  2. You click Generate. `ImagenClient` packs the photo + settings into a FormData parcel.
  3. The parcel is POSTed to `/api/generate-cyberpunk` — the app's own server.
  4. The server picks an unused Gemini API key from its pool, converts the photo to base64, and glues it to a written style instruction.
  5. Gemini reads the picture and the instruction and sends back a **new picture, encoded as text**.
  6. The server uploads that picture to Cloudflare R2 storage and gets back a public web address.
  7. The address travels back to the browser, gets dropped into `setGeneratedImage(...)`, and React repaints the right-hand panel.

- **Code ↔ English translation** — at minimum the `handleFileUpload` snippet and the FormData snippet. Line-by-line English on the right.
- **Quiz** — 3 questions, scenario/tracing style. Suggested angles:
  1. A user says "I dropped my photo in and the thumbnail appeared instantly, even with my wifi off." Which stations had already run? (Answer: 1–2 only; FileReader is entirely local. Teaches the local/remote boundary.)
  2. The preview panel stays empty but the browser's network tab shows the POST returned successfully with an `imageUrl`. Where would you look first? (Answer: the handling of the response in the browser — `result.code === 0` — not the AI. Sets up module 5.)
  3. You want to add "generate three variations at once." Which station's shape changes most? (Answer: the server route + the Gemini call; the upload UI already accepts 5 images. Tests architecture reading.)
- **Callout box** — "aha!": *An image on the web is just text if you squint.* base64 / data URLs mean the same picture can travel as a string of letters through channels that only carry text. This is why AI APIs can hand pictures back over a text connection.
- **Glossary tooltips** (first use, aggressive): browser, server, API, endpoint, route, FormData, POST, data URL, base64, MIME type, state, React, component, upload, storage bucket, response, JSON.

## Reference Files to Read

- `references/content-philosophy.md` — all of it
- `references/gotchas.md` — all of it
- `references/interactive-elements.md` → "Message Flow / Data Flow Animation", "Code ↔ English Translation Blocks", "Multiple-Choice Quizzes", "Callout Boxes", "Numbered Step Cards", "Glossary Tooltips"
- `references/design-system.md` → "Module Structure", "Typography", "Color Palette"

## Connections

- **Previous module:** none — this is the opening. Open by explaining what the app is.
- **Next module:** *Front of House, Backstage* — which of these stations run in the visitor's browser, which run on the company's server, and why the API key can only ever live on one side. End module 1 by teasing that question: "Station 3 crossed a line. That line is the single most important thing to understand about this app — and it's next."
- **Tone/style notes:** Accent colour is teal. Refer to code files by their real paths. Call the generator's client component **`ImagenClient`** and the server route **`/api/generate-cyberpunk`** consistently — every module uses those names. Never call the learner a "developer." Never say "as you know."
- **Naming gotcha to mention once, lightly:** the endpoint is called `generate-cyberpunk` even though the app makes children's-book art — it's a leftover name from the template this app was built from. Mention it as a joke and move on; module 5 covers stale naming properly.
