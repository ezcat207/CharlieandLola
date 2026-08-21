# Module 6: Every Language, Every Screen

> You are writing ONE module of a 7-module course about a real, live web app.
> The app: **charlieandlola.net** — upload a selfie, get a Charlie & Lola cartoon character
> from Google's Gemini AI. Free to try, sign in to download, buy credits for more.
> Next.js 15 + TypeScript + Tailwind CSS + Shadcn UI. It runs in English and Chinese.

### Teaching Arc

- **Metaphor:** **The museum audio guide.** The museum is built once. The paintings hang where they
  hang, the corridors run where they run. At the door you pick a language and get a handset, and
  from then on every plaque you stand in front of is narrated in *your* language. Nobody built a
  second museum for Mandarin speakers. The building is the **structure** (components and layout);
  the narration is the **content** (translation files); the handset you pick up at the door is the
  **locale**. Use museum / handset / narration / plaques throughout.
- **Opening hook:** "Every error message we've quoted so far has been in English. Add `/zh` to the
  address bar of this app and the entire thing becomes Chinese — same buttons, same layout, same
  code. Not one component was duplicated to make that happen."
- **Key insight:** **Separate structure from content.** The moment text stops living inside your
  components and starts living in data files, you get translations, A/B tests, and non-developers
  editing marketing copy — all for free. It's the same principle as Module 2's "the page is a
  template, the content is data", now applied to every word on the site.
- **"Why should I care?":** Two things. (1) Retro-fitting translation into an app where text is
  scattered across 200 components is a brutal, expensive job — knowing to say *"put user-facing
  strings in the translation files, not inline"* on day one saves weeks. (2) The same discipline
  applies to design: this app has 37 tiny reusable interface pieces and a colour palette defined in
  exactly one file, which is why "make the whole site more orange" is a one-line change.

### Half One: Two Languages, One App

**The doorman.** A file called `middleware.ts` runs *before every single page request*. It looks at
the address, works out which language you want (from the URL, or your browser's settings), and
routes you accordingly. It's twelve lines long and it is the reason `/zh/pricing` works at all.

**Two kinds of text, two different homes.** This is the screen most worth getting right:

| Kind | Where it lives | Example |
|---|---|---|
| **Interface labels** — buttons, errors, form hints | `src/i18n/messages/en.json` and `zh.json` | `"sign_in": "Sign In"` |
| **Page content** — the whole marketing page, section by section | `src/i18n/pages/landing/en.json` and `zh.json` | the hero headline, the FAQ list, all 8 pricing plans |

The second one is the surprising one. The entire landing page — hero, features, testimonials, FAQ,
pricing — is a JSON file with keys named `hero`, `introduce`, `benefit`, `usage`, `feature`,
`stats`, `testimonial`, `faq`, `cta`, `footer`. Module 2 showed the page component drawing each
section only if the data exists. **This is where that data comes from.** You can rewrite the entire
marketing site without touching a single line of code.

**The fallback chain** is a small, elegant thing worth showing: unknown language → try to load its
file → if that fails for any reason, quietly serve English. Users see a page in the wrong language
rather than an error page. Same idea as Module 5's graceful degradation, in a new costume.

**Prices are localised too, not just words.** The Chinese pricing file carries a `cn_amount`, and
Chinese checkouts add WeChat Pay and Alipay. Localisation isn't translation — it's *adaptation*.

### Half Two: Building the Interface Out of Standard Parts

**Three layers of interface**, from smallest to largest — present as a diagram or step cards:
1. **Tailwind CSS** — instead of writing style rules in a separate file, you write tiny class names
   directly on the element: `className="flex items-center gap-2 rounded-md"`. Divisive, but very
   fast, and there's no such thing as "which stylesheet is this coming from?"
2. **`src/components/ui/` (Shadcn UI)** — 37 generic parts: button, card, dialog, tabs, tooltip,
   table. Crucially, these are **not** an installed library — the code was copied *into* the
   project, so it can be edited. That's the whole idea of Shadcn: you own the parts.
3. **`src/components/blocks/`** — whole page sections assembled from the parts: `hero`, `pricing`,
   `faq`, `footer`, `showcase`.

**Variants.** A button isn't one button — it's a small menu of options (`variant`: default,
destructive, outline, secondary, ghost, link; `size`: default, sm, lg, icon). One file defines every
button that will ever appear on the site. Worth naming out loud: this is *why* the site looks
consistent, and it's what "design system" actually means in practice.

**One palette, one file.** All colours are defined once as CSS custom properties in
`src/app/theme.css`, in a colour format called `oklch`. The brand palette is named after the
cartoon: `--cl-yellow`, `--cl-orange`, `--cl-blue`, `--cl-pink`, `--cl-green`, `--cl-red`,
`--cl-brown`. Dark mode is the same variable names redefined. Nothing hardcodes a hex code.

### Code Snippets (pre-extracted — use verbatim, do not edit)

**Snippet A — the doorman. The whole file is twelve lines.**
File: `src/middleware.ts` (whole file)

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|en-US|zh|zh-CN|zh-TW|zh-HK|zh-MO|ja|ko|ru|fr|de|ar|es|it)/:path*",
    "/((?!privacy-policy|terms-of-service|api/|_next|_vercel|.*\\..*).*)",
  ],
};
```

Worth pointing out: the list of languages the doorman *recognises* is much longer than the two the
app actually *supports*. Also note `api/` is deliberately excluded — API endpoints don't need a
language prefix. That third pattern is a **regular expression**, a compact notation for "match
these addresses but not those" — tooltip it, don't explain it in depth.

**Snippet B — only two languages are real.**
File: `src/i18n/locale.ts` (lines 3–12)

```ts
export const locales = ["en", "zh"];

export const localeNames: any = {
  en: "English",
  zh: "中文",
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";
```

`"as-needed"` is a small, real product decision: English is the default, so it gets the clean URL
(`/pricing`), and only other languages get a prefix (`/zh/pricing`).

**Snippet C — the fallback chain.**
File: `src/i18n/request.ts` (lines 18–30)

```ts
  try {
    const messages = (await import(`./messages/${locale.toLowerCase()}.json`))
      .default;
    return {
      locale: locale,
      messages: messages,
    };
  } catch (e) {
    return {
      locale: "en",
      messages: (await import(`./messages/en.json`)).default,
    };
  }
```

**Snippet D — the whole marketing page is a data file, loaded by language.**
File: `src/services/page.ts` (lines 15–33)

```ts
export async function getPage(
  name: string,
  locale: string
): Promise<LandingPage | PricingPage | ShowcasePage> {
  try {
    if (locale === "zh-CN") {
      locale = "zh";
    }

    return await import(
      `@/i18n/pages/${name}/${locale.toLowerCase()}.json`
    ).then((module) => module.default);
  } catch (error) {
    console.warn(`Failed to load ${locale}.json, falling back to en.json`);

    return await import(`@/i18n/pages/${name}/en.json`).then(
      (module) => module.default
    );
  }
}
```

**Snippet E — one button, six looks.**
File: `src/components/ui/button.tsx` (lines 12–27)

```tsx
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
```

**Snippet F — the whole brand, in one place.**
File: `src/app/theme.css` (lines 25–31)

```css
  --cl-yellow: oklch(0.9 0.15 85);
  --cl-orange: oklch(0.8 0.15 60);
  --cl-blue: oklch(0.8 0.08 200);
  --cl-pink: oklch(0.8 0.1 340);
  --cl-green: oklch(0.85 0.15 140);
  --cl-red: oklch(0.7 0.2 25);
  --cl-brown: oklch(0.6 0.1 60);
```

### Interactive Elements (all required)

- [x] **Code↔English translation** — at least three: Snippet A (the doorman), Snippet D (page
      content as data), and Snippet E (button variants) or Snippet C (the fallback).
- [x] **Data flow animation** — the hero visual. Actors: `Browser` → `Middleware` → `Page` →
      `Translation Files` → `Browser`. Steps: (1) Someone requests `/zh/pricing`. (2) The doorman
      middleware reads `zh` out of the address. (3) The page component is told "this request is
      Chinese". (4) It loads `messages/zh.json` for labels and `pages/pricing/zh.json` for content.
      (5) The *same* components render, filled with Chinese text and CNY prices. (6) Show the
      fallback branch: an unsupported language quietly gets English instead of an error.
- [x] **Side-by-side comparison** — the same interface rendered in English and Chinese from the same
      component, with the JSON key shown in the middle. E.g. `"sign_in"` → "Sign In" / "登录".
      This is the visual that makes the whole idea click; make it prominent.
- [x] **Pattern/feature cards** — the three interface layers (Tailwind → ui/ parts → blocks), and/or
      the button variants shown as actual styled chips.
- [x] **Quiz** — 3–4 questions, scenario style:
      1. "The marketing team wants to change the headline on the home page. Do they need a
         developer?" (Correct: no — it's a text field in a JSON data file. Wrong options teach that
         it's not in the component and not in the database.)
      2. "You add a French version. What do you have to create, and what do you *not* have to
         touch?" (Correct: add `fr` to the locale list and add the JSON files; you don't duplicate
         a single component.)
      3. "A user in Germany visits and the app has no German. What do they see?" (Correct: English —
         the fallback. Not an error page, not a blank page.)
      4. "You ask an AI to add a new 'Danger' button style. Where should it go, and why does that
         matter?" (Correct: as a new variant in the one button file — so every Danger button on the
         site stays identical and can be changed in one place.)
- [x] **Glossary tooltips** — aggressive. At minimum: internationalisation/i18n, locale, middleware,
      JSON, key/value, fallback, hardcode, CSS, Tailwind, class name, component library, Shadcn,
      variant, CSS custom property/variable, dark mode, hex code, `oklch`, regular expression, URL
      prefix, render, prop, design system, currency code, CNY.
- [x] **Callout boxes** — one "aha" on *separate structure from content and you get translation,
      experiments and non-developer edits for free*; one on *localisation is adaptation, not just
      translation* (the WeChat Pay / Alipay / `cn_amount` example).

### Screens (aim for 5–6)

1. **The audio guide** — metaphor; the `/zh` reveal.
2. **The doorman** — Snippet A + B, the flow animation as hero visual.
3. **Two kinds of text** — the table above, the side-by-side English/Chinese comparison, Snippet D.
4. **When there's no translation** — Snippet C, the fallback, localisation-as-adaptation callout.
5. **Building from standard parts** — the three layers, Snippet E, variants as visual chips.
6. **One palette** — Snippet F, dark mode, then the quiz.

### Reference Files to Read

- `references/content-philosophy.md` — all of it.
- `references/gotchas.md` — all of it.
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Multiple-Choice
  Quizzes", "Message Flow / Data Flow Animation", "Pattern/Feature Cards", "Callout Boxes",
  "Glossary Tooltips", "Layer Toggle Demo", "Icon-Label Rows", "Flow Diagrams".
- `references/design-system.md` → "Module Structure", "Color Palette", "Typography".

### Connections

- **Previous module: "Memory and the Outside World"** — the eight database tables, schema and
  migrations, connection pooling, the Gemini API key pool, graceful degradation, and two real
  gotchas (a Supabase database that had been deleted, and a password hardcoded into
  `src/db/index.ts`). It ended by noting that every error message quoted so far was in English,
  but the app runs in two languages and none of that text lives in the components. Open on that.
- **Next module: "When It Breaks"** — debugging intuition and how the app actually gets onto the
  internet (Vercel, Cloudflare, Docker) — the final module, which also recaps the whole course.
  End by pointing forward: everything so far has been *how it works*. The last module is *what to
  do when it doesn't*, and how all of this gets from a laptop onto the real internet.
- **Tone/style notes:** Accent colour is **vermillion** (warm red-orange). Warm developer-notebook
  feel. Zero jargon without a tooltip. Second person. The learner is a "vibe coder" — builds
  software by instructing AI, no CS background. **Never use a restaurant/kitchen metaphor.**
  Already used elsewhere and off-limits here: photo lab (M1), film production (M2), festival
  wristband (M3), chequebook register (M4), blueprints-and-permits (M5). Actor naming across the
  course: **Browser, Server, Gemini, Database, Stripe, Storage** — capitalised, consistent.
  Your file must contain ONLY `<section class="module" id="module-6"> ... </section>` — no
  `<html>`, `<head>`, `<body>`, `<style>` or `<script>` tags. Write it to
  `courses/general-course/modules/06-every-language-every-screen.html`.
