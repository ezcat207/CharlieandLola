# Module 2: Front of House, Backstage

**Output file:** `courses/image-generator-ui-course/modules/02-actors.html`
**Section wrapper:** `<section class="module" id="module-2">`

## Teaching Arc

- **Metaphor:** **A theatre.** Front of house is what the audience sees: the stage, the actors, the programme in their hands. Backstage is the fly system, the lighting desk, and the safe in the manager's office with the keys in it. The audience can walk right up to the stage — they can never walk into the office. In this app, "front of house" is the visitor's browser and "backstage" is the company's server, and the single line `'use client'` at the top of a file is the stage door. (Metaphor is exclusive to this module — module 1 used a photo lab, module 4 uses a LEGO box.)
- **Opening hook:** "The Google API key that pays for every image this app makes is sitting in a file right now. If it ever reached a visitor's browser, a stranger could run up the bill. Here's the wall that keeps it from happening — and how you can tell which side of the wall any file is on."
- **Key insight:** Every file in a Next.js app runs on exactly one of two machines, and you can tell which by looking at the top line and at what the file touches. Files with `'use client'` are shipped to strangers. Files without it run only on the server, and only their *output* is shipped. Secrets, and anything expensive, must live on the server side.
- **"Why should I care?":** This is the #1 thing AI coding assistants get wrong in Next.js projects — they put a `useState` in a server file, or read `process.env.SECRET` in a client file, and the error messages are famously confusing ("useState is not a function", "hydration mismatch"). If you can spot which side a file belongs to, you can correct the AI in one sentence instead of ten rounds of trial and error.

## The cast (build the architecture visual around these five)

| Actor | File | Side | Job |
|---|---|---|---|
| **The Page** | `src/app/[locale]/(default)/page.tsx` | server | The homepage. Renders the generator plus ten marketing sections below it. |
| **ImagenWrapper** | `src/components/blocks/imagen-wrapper/index.tsx` | server | Looks up every piece of English/Chinese text the generator needs, bundles it into one plain object, hands it down as a prop. |
| **ImagenClient** | `src/components/blocks/imagen-wrapper/imagen-client.tsx` | client (893 lines) | Everything interactive: drag-and-drop, previews, the Generate button, spinners, toasts, localStorage. |
| **The route** | `src/app/api/generate-cyberpunk/route.ts` | server | The only door between the two worlds. Validates, spends credits, calls Gemini, stores the result. |
| **The key pool** | `src/lib/gemini-api-pool.ts` | server | Holds the Gemini API keys read from environment variables. Never leaves the building. (Module 3 covers how it rotates them.) |

## Code Snippets (pre-extracted — use VERBATIM, do not trim or reformat)

**File: `src/components/blocks/imagen-wrapper/index.tsx` (lines 8–18)** — the server wrapper
```
export default async function ImagenWrapper({ locale = 'en' }: ImagenWrapperProps = {}) {
  // Set the request locale for server-side translations
  setRequestLocale(locale);

  // Get the translations on the server side with explicit locale
  const t = await getTranslations({ locale, namespace: 'imagen' });

  // Pass translations as props to the client component
  const translations = {
    badge: { text: t('badge.text') },
    title: { main: t('title.main'), subtitle: t('title.subtitle') },
```

**File: `src/components/blocks/imagen-wrapper/index.tsx` (line 82)** — the hand-off
```
  return <ImagenClient translations={translations} />;
```

**File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 1–8)** — the stage door
```
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserCredits } from '@/hooks/useUserCredits';
```

**File: `src/lib/gemini-api-pool.ts` (lines 19–27)** — what only the server can see
```
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

**File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 776–782)** — the one env var that IS allowed in the browser, because of its name
```
                    {t.buttons.generate}
                    <span className="text-cl-blue font-medium">
                      {process.env.NEXT_PUBLIC_FREE_MODE_ENABLED === 'true' 
                        ? `(${t.buttons.limited_free})`
                        : `(${modelOptions.find(m => m.value === selectedModel)?.credits || 10} credits)`
                      }
                    </span>
```
> Teaching note for this last one: the `NEXT_PUBLIC_` prefix is a promise you make to the framework — "it is safe for strangers to read this one." Anything with that prefix gets baked into the JavaScript sent to browsers. Anything without it is stripped out. Naming is the entire security mechanism, which is why a typo here is a real leak.

## Interactive Elements (all required)

- **Group chat animation** (this module's hero visual — `references/interactive-elements.md` → "Group Chat Animation"). This is the mandatory group-chat element for the whole course, so make it good. Frame it as a backstage group chat between the five actors above the moment a visitor loads the homepage. Suggested script:
  - **The Page:** "Visitor incoming, locale `en`. Wrapper, you're up."
  - **ImagenWrapper:** "On it. Pulling all 40-odd strings from the `imagen` namespace… badge, title, upload prompts, error messages. Bundling."
  - **ImagenClient:** "Just send me the finished words. I can't read translation files — I run on a stranger's laptop."
  - **ImagenWrapper:** "Here. One plain object, already in English." *(hands over `translations`)*
  - **ImagenClient:** "Great. I'll take it from here — drag-and-drop, previews, the button. Route, stand by."
  - **The route:** "Standing by. Nobody talks to Gemini except me."
  - **ImagenClient:** "Can I just have the API key? It'd save a round trip."
  - **The key pool:** "Absolutely not. 😊"
  - **The route:** "It'd be in the page source in about four seconds. Send me the photo, I'll send you a picture."
- **Code ↔ English translation** — at minimum the `'use client'` snippet and the `ImagenWrapper` translations snippet. Emphasise that `getTranslations` is `await`ed — a server component may pause and go look things up; a client component may not.
- **Quiz** — 3–4 questions, architecture/debugging style. Suggested angles:
  1. You ask an AI to "add a dropdown that remembers the last style the user picked." It writes the code into `index.tsx` (the wrapper). What goes wrong, and what's the one-line correction to give it? (Answer: remembering = state = client side. Tell it to put the dropdown in `imagen-client.tsx`, or make a new `'use client'` component.)
  2. A teammate adds `process.env.GEMINI_API_KEY` to `imagen-client.tsx` to "speed things up." What's the actual consequence? (Answer: undefined at best because the prefix is missing — and if they "fixed" it by renaming to `NEXT_PUBLIC_GEMINI_API_KEY`, they'd publish the key to every visitor.)
  3. Why does `ImagenWrapper` exist at all, when `ImagenClient` could fetch its own text? (Answer: translations are chosen per-visitor per-language on the server, so the correct words are already in the HTML before any JavaScript runs — faster first paint, and search engines see real text.)
  4. Optional: the 893-line `imagen-client.tsx` holds upload, preview, prompt editing, download and share. What's the practical cost of that? (Answer: everything in it ships to every visitor and every change risks the whole panel; the honest answer is "it works, but it's the file you'd split first.")
- **Callout box** — "aha!": *The browser is a hostile environment you don't control.* Everything you send there can be read, edited and replayed by whoever's holding the laptop. The client/server line isn't bureaucracy — it's the only place secrets can hide.
- **Optional extra:** an architecture diagram or visual file tree showing the five actors with a vertical wall between browser and server.
- **Glossary tooltips** (first use): server component, client component, `'use client'`, hydration, props, environment variable, `process.env`, API key, locale, internationalisation (i18n), namespace, `await` / asynchronous, prop drilling, bundle, page source.

## Reference Files to Read

- `references/content-philosophy.md` — all of it
- `references/gotchas.md` — all of it
- `references/interactive-elements.md` → "Group Chat Animation", "Code ↔ English Translation Blocks", "Multiple-Choice Quizzes", "Callout Boxes", "Visual File Tree", "Interactive Architecture Diagram", "Glossary Tooltips"
- `references/design-system.md` → "Module Structure", "Color Palette"

## Connections

- **Previous module:** *The Journey of One Photo* — traced a single generation through seven stations, ending at the moment the parcel crossed from browser to server. Open by picking that moment back up.
- **Next module:** *Commissioning the Artist* — what the server actually says to Gemini, and how it juggles six API keys so one exhausted key doesn't take the site down. Tease: "Backstage, there's a drawer with up to six keys in it. Only one gets used per request, and the drawer remembers which ones are burnt."
- **Tone/style notes:** Accent colour is teal. Keep the five actor names exactly as in the table — modules 3 and 5 reuse them. Even/odd module backgrounds alternate automatically; don't add your own background overrides.
