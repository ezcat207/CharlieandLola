# Module 2: Meet the Cast — How the Code Is Organised

> You are writing ONE module of a 7-module course about a real, live web app.
> The app: **charlieandlola.net** — you upload a selfie, it turns it into a Charlie & Lola
> children's-cartoon-style character using Google's Gemini AI. Free to try, sign in to
> download, buy credits for more. Built with Next.js 15 and TypeScript, ~330 code files.

### Teaching Arc

- **Metaphor:** **A film production.** The **cast** are the parts you see on screen (the buttons,
  the upload box, the preview panel — the React components). The **crew** work behind the camera
  and never appear in the shot (the server code — API routes, services, models). The **props
  department** keeps a shelf of generic, reusable objects that any scene can borrow — a chair, a
  mug, a lamp (the `ui/` folder: buttons, cards, dialogs). And there is a strict **chain of
  command**: an actor doesn't wander into the accounts office to rewrite the budget; requests go
  up the chain in order. Use "cast / crew / props / chain of command" throughout.
- **Opening hook:** "In Module 1 a message travelled through five different pieces of code. Nobody
  introduced them. Let's meet the cast — because the single most useful thing you can tell an AI
  coding assistant is *where* a change belongs."
- **Key insight:** This codebase is organised in **layers**, and each layer is only allowed to talk
  to the one below it. Route → Service → Model → Database. Nobody skips a step. Layers exist so
  that a rule (like "10 credits per image") is written down in exactly one place.
- **"Why should I care?":** When you tell an AI "add a rule that Pro users get 3 free generations
  a day", it has to put that rule *somewhere*. If it puts it in a button, you'll have the rule in
  five places and four of them will be wrong within a month. Knowing the layers lets you say
  "put that in the credit service, not in the component" — and that one sentence is often the
  difference between a codebase that survives a year and one that doesn't.

### The Map (this is the spine of the module)

The real top-level structure of `src/`:

| Folder | Who they are | What lives there |
|---|---|---|
| `src/app/` | **The stage** | Every page and every API endpoint. The folder path *is* the URL. |
| `src/components/blocks/` | **The cast** | Big page sections: `hero`, `pricing`, `faq`, `footer`, `imagen-wrapper`. |
| `src/components/ui/` | **The props department** | 37 small generic pieces: `button.tsx`, `card.tsx`, `dialog.tsx`, `tabs.tsx`. |
| `src/services/` | **The crew chiefs** | Business rules: `credit.ts`, `order.ts`, `user.ts`, `stripe.ts`, `affiliate.ts`. |
| `src/models/` | **The records office** | The only files allowed to touch the database: `user.ts`, `credit.ts`, `order.ts`, `post.ts`. |
| `src/db/` | **The filing cabinet itself** | `schema.ts` (table shapes) + `index.ts` (the connection). |
| `src/auth/` | **Security** | Who you are (covered in Module 3). |
| `src/i18n/` | **Translation department** | English and Chinese text (Module 6). |
| `src/lib/` | **The toolbox** | Small helpers used by everyone: `hash.ts`, `time.ts`, `resp.ts`, `storage.ts`. |
| `src/aisdk/` | **The specialist rig** | A hand-built adapter for the Kling video-generation service. |

**The routing trick worth its own screen:** in Next.js, folders under `src/app/` literally become
web addresses. `src/app/[locale]/(default)/pricing/page.tsx` becomes `charlieandlola.net/en/pricing`.
`src/app/api/checkout/route.ts` becomes `charlieandlola.net/api/checkout`. Two special notations:
- `[locale]` — square brackets mean "anything goes here, and tell me what it was". That's how
  `/en/pricing` and `/zh/pricing` are the same file.
- `(default)`, `(admin)`, `(console)` — round brackets mean "this folder is for *organising* only,
  it does NOT appear in the URL". `(admin)/admin/orders/page.tsx` is just `/admin/orders`.
This is a genuinely confusing convention and worth a visual file tree.

### The Other Big Divide: Server vs Client

Some components run on the company's server before the page is even sent to you. Others run in
your browser. The line is drawn by one line of text at the top of a file: `'use client'`.
The clearest example in this codebase is a matched pair:

- `imagen-wrapper/index.tsx` — **server**. It looks up the translated text and hands it down.
- `imagen-wrapper/imagen-client.tsx` — **client**, marked `'use client'`. It handles clicks,
  drag-and-drop, spinners — anything that reacts to a human.

Why split? Server components can read secrets and databases; client components can't (anything in
the browser can be read by the user). Client components can respond to clicks; server components
can't. So this pair is a hand-off: server fetches, client interacts.

### Code Snippets (pre-extracted — use verbatim, do not edit)

**Snippet A — the chain of command, in three files.** Show these three as a stacked
"route → service → model" sequence. This is the module's centrepiece.

*Layer 1 — the route (takes the request, returns a reply). File: `src/app/api/generate-cyberpunk/route.ts` (lines 51–61)*

```ts
    // Get user info
    const userUuid = await getUserUuid();
    const isRegisteredUser = !!userUuid;

    // Check credits for registered users
    if (isRegisteredUser) {
      const userCredits = await getUserCredits(userUuid);
      if (userCredits.left_credits < CreditsAmount.ImageGeneration) {
        return respErr(`Insufficient credits. You need ${CreditsAmount.ImageGeneration} credits but only have ${userCredits.left_credits}. Please recharge to continue.`, 'INSUFFICIENT_CREDITS');
      }
    }
```

*Layer 2 — the service (knows the business rules). File: `src/services/credit.ts` (lines 22–26)*

```ts
export enum CreditsAmount {
  NewUserGet = 30,
  PingCost = 1,
  ImageGeneration = 10,
}
```

*Layer 3 — the model (the only code that touches the database). File: `src/models/credit.ts` (lines 62–72)*

```ts
export async function getAllUserCredits(
  user_uuid: string
): Promise<(typeof credits.$inferSelect)[] | undefined> {
  const data = await db()
    .select()
    .from(credits)
    .where(eq(credits.user_uuid, user_uuid))
    .orderBy(asc(credits.created_at));

  return data;
}
```

**Snippet B — the server half of the hand-off.**
File: `src/components/blocks/imagen-wrapper/index.tsx` (lines 8–18)

```tsx
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

**Snippet C — the client half. Note the very first line.**
File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 1–12)

```tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserCredits } from '@/hooks/useUserCredits';
import CreditDisplay from '@/components/blocks/credits-display';
import { toast } from 'sonner';
import { convertToCdnUrl } from '@/lib/cdn-url';
import { useTheme } from '@/contexts/theme-context';
```

**Snippet D — the landing page as an assembly of cast members.** Notice that the page barely
contains any content of its own; it's a list of sections, each fed a slice of data.
File: `src/app/[locale]/(default)/page.tsx` (lines 233–243)

```tsx
      <ImagenWrapper locale={locale} />
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Feature section={page.feature} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.stats && <Stats section={page.stats} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
```

The `&&` here means "only draw this section if there's content for it" — the whole landing page
is switched on and off by a data file. That's worth an "aha": *the page is a template; the content
is data.* (Module 6 shows where that data lives.)

### Interactive Elements (all required)

- [x] **Code↔English translation** — at least two. Snippet A's three layers (present as three
      small stacked translation blocks, or one with clear separation) and Snippet C or D.
- [x] **Visual file tree** — the `src/` map above, annotated with the film-crew roles. This is the
      module's hero visual. Include the `[locale]` and `(default)` notation explanation as
      annotations or a small side-by-side "folder path → real URL" comparison.
- [x] **Layer toggle demo OR interactive architecture diagram** — show the four layers
      (Route / Service / Model / Database) and let the learner click through them. Emphasise the
      rule: each layer talks only to the one below.
- [x] **Quiz** — 3–4 questions, scenario style:
      1. "You want to change the cost of generating an image from 10 credits to 5. Which file?"
         (Correct: `src/services/credit.ts`, the `CreditsAmount` list — one place, everywhere gets it.
         Wrong options: the button component / the database / every API route.)
      2. "An AI assistant writes database queries directly inside a page component. Why should you
         push back?" (Correct: it skips two layers, so the rule now lives in two places and the
         page can't run on the server safely / duplicated logic drifts.)
      3. "You need a component that shows a live countdown timer that updates every second. Server
         component or client component, and how do you tell the AI?" (Correct: client — it reacts
         to time/interaction; say "mark it `'use client'`".)
      4. "Where in the URL does the folder `(console)` show up?" (Correct: nowhere — round brackets
         are organisation only.)
- [x] **Glossary tooltips** — aggressive. At minimum: component, React, TypeScript, Next.js,
      route, folder/directory, import, function, `props`, service layer, model, schema, database,
      business logic, server-side, client-side, render, framework, enum, hook, URL path, deploy.
- [x] **Callout boxes** — one "aha" on *a rule should live in exactly one place* (this is the
      single most transferable idea in the module); one on *the page is a template, the content is
      data*.

### Screens (aim for 5)

1. **The film production metaphor** + why organisation is a survival skill for a codebase.
2. **The map** — the visual file tree, annotated. Hero visual.
3. **Folders become URLs** — `[locale]` and `(default)` explained side by side with real examples.
4. **The chain of command** — Snippet A's three layers, the layer toggle/diagram, the "one place"
   callout.
5. **Cast vs crew** — `'use client'`, Snippets B and C as the hand-off pair, Snippet D as the
   assembled page. Then the quiz.

### Reference Files to Read

- `references/content-philosophy.md` — all of it.
- `references/gotchas.md` — all of it.
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Multiple-Choice
  Quizzes", "Visual File Tree", "Interactive Architecture Diagram", "Layer Toggle Demo",
  "Callout Boxes", "Glossary Tooltips", "Icon-Label Rows", "Pattern/Feature Cards".
- `references/design-system.md` → "Module Structure", "Color Palette", "Typography".

### Connections

- **Previous module: "What Happens When You Click Generate"** — traced one message from the
  browser through the API route to Google's Gemini AI and back. It used the terms Browser, Server,
  Gemini. It already showed `src/app/api/generate-cyberpunk/route.ts` and
  `imagen-client.tsx`, so you can refer back to them as familiar faces.
- **Next module: "Who Are You?"** — sign-in, sessions, and how the server knows which account a
  request belongs to. End by pointing forward: the route in Snippet A called `getUserUuid()` and
  we just accepted that it works. Next module opens that box.
- **Tone/style notes:** Accent colour is **vermillion** (warm red-orange). Warm developer-notebook
  feel. Zero jargon without a tooltip. Second person. The learner is a "vibe coder" — builds
  software by instructing AI, no CS background. **Never use a restaurant/kitchen metaphor.**
  Module 1 used the photo-lab metaphor; don't reuse it. Actor naming across the course:
  **Browser, Server, Gemini, Database, Stripe, Storage** — capitalised, consistent.
  Your file must contain ONLY `<section class="module" id="module-2"> ... </section>` — no
  `<html>`, `<head>`, `<body>`, `<style>` or `<script>` tags. Write it to
  `courses/general-course/modules/02-meet-the-cast.html`.
