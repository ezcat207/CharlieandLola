# Module 5: Tapping the Walls

**Output file:** `courses/image-generator-ui-course/modules/05-breaks.html`
**Section wrapper:** `<section class="module" id="module-5">`

## Teaching Arc

- **Metaphor:** **A home inspection.** An inspector doesn't wait for the ceiling to fall in. They walk the house tapping walls, listening for the hollow spot, checking whether the switch by the door is actually wired to anything. Most of what they find isn't dangerous — it's *disconnected*. Wires that go nowhere, a light switch that was rewired during a renovation and never removed. That's exactly what's in this codebase, and it's in yours too. (Exclusive to this module — 1 photo lab, 2 theatre, 3 illustrator, 4 LEGO box.)
- **Opening hook:** "Every single one of the five faults below is real, is in this app right now, and none of them crash anything. That's what makes them worth studying — the bugs that crash are easy."
- **Key insight:** The most common bug in an AI-assisted codebase isn't broken logic — it's **two halves that were each written correctly and never introduced to each other.** A control that no longer sends its value. A CSS rule waiting for an attribute nobody stamps. A branch checking a field with a name that doesn't exist. Every one of these is invisible to the compiler and invisible in testing, because nothing errors — the code just quietly does nothing.
- **"Why should I care?":** This is the module that pays for the other four. You now know the seven stations, both sides of the wall, the shape of the AI call and the four styling layers — so you can look at a symptom and name the station. That's how you escape a bug loop with an AI assistant: not by asking "why is it broken?" but by saying "this branch never runs because the server sends `message` and the client reads `msg` — fix the client."

## The five faults (verified in the codebase — each is real)

### Fault 1 — The reply nobody reads (the hero exhibit)

The server, in `src/lib/resp.ts`, answers with a field called **`message`**. The client, in `imagen-client.tsx`, checks **`result.msg`**. Those are different words, so those branches can never run — the "you're in a queue, upgrade to skip it" message never appears, no matter how busy the service gets. The user just sees the generic "generation failed" toast.

The cruel detail: **twenty lines later, in the same function, the same developer got it right** — the insufficient-credits branch checks `result.data` and `result.message`, which do exist. One works. One doesn't. Nothing warns you.

There's a second layer: `respErr` always returns `code: -1`. So the whole `else if (result.code === 1)` branch is unreachable too — a `code` of 1 is a value this app never produces.

### Fault 2 — Three controls with the wires cut

```
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [selectedModel, setSelectedModel] = useState('pro');
```
`setAspectRatio`, `setOutputFormat` and `setSelectedModel` are **never called anywhere in the file.** These three values can never change from their starting values. The Generate button still cheerfully reads `selectedModel` to print "(10 credits)" next to itself.

And on the other side, the server *validates* `aspectRatio` and `outputFormat` carefully — rejecting anything not in its allowed list — then never passes either one to Gemini. It echoes them back in the response. So even if the picker existed and worked, choosing 9:16 would change nothing about the picture.

### Fault 3 — The CSS that's waiting for a phone call

`src/app/theme.css` styles the app's chunky Charlie-and-Lola buttons with hard offset shadows via `[data-slot="button"][data-variant="default"]`. But `src/components/ui/button.tsx` only ever stamps `data-slot="button"` — it never writes a `data-variant` attribute. The selector requires both. It matches nothing. Those hand-written shadows and the translate-on-hover effect have never rendered once.

Compare with the card rule from module 4 (`[data-slot="card"]`) which works perfectly, because `card.tsx` really does stamp `data-slot="card"`. Same technique, one letter of difference between working and dead.

### Fault 4 — The button that lies about needing a login

When nobody is signed in, the Generate button renders a padlock icon and the words "login required". But `disabled={uploadedImages.length === 0 || isGenerating}` says nothing about being signed in, and `generateImage()` doesn't check for a session either — it just runs. So the button says you must sign in, and then generates your image anyway. (The server *does* treat guests differently — it returns `requiresRegistration: true` and skips charging credits. So the behaviour is deliberate; only the label is stale.)

### Fault 5 — The word that was never delivered

`imagen-client.tsx` reads `t.buttons.limited_free` when free mode is switched on. The phrase exists in both translation files (`"limited_free": "Limited Free"` / `"限免"`). But the `Translations` interface at the top of the file doesn't list it, and `index.tsx` — the server wrapper that hand-copies every string into an object — never copies it across. The word is written, translated, and never picked up. Turn free mode on and the button reads `(undefined)`.

This is the price of that hand-written wrapper from module 2: **every new piece of text has to be added in three places** (the JSON, the interface, the mapping), and forgetting one fails silently.

## Code Snippets (pre-extracted — use VERBATIM, do not trim or reformat)

**File: `src/lib/resp.ts` (lines 9–22)** — what the server actually sends
```
export function respErr(message: string, data?: any) {
  return respJson(-1, message, data);
}

export function respJson(code: number, message: string, data?: any) {
  let json: { code: number; message: string; data?: any } = {
    code: code,
    message: message,
  };
  if (data) {
    json.data = data;
  }

  return Response.json(json);
}
```

**File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 369–378)** — what the client looks for. This is the "spot the bug" exhibit.
```
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

**File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 390–396)** — the branch that works, for contrast
```
      } else if (result.code === -1) {
        // Handle error responses (including insufficient credits)
        if (result.data === 'INSUFFICIENT_CREDITS' || result.message?.includes('Insufficient credits')) {
          toast.error(result.message || 'Insufficient credits to generate image');
          return;
        }
        throw new Error(result.message || 'Generation failed');
```

**File: `src/components/blocks/imagen-wrapper/imagen-client.tsx` (lines 134–136)** — the cut wires
```
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [selectedModel, setSelectedModel] = useState('pro');
```

**File: `src/app/theme.css` (lines 164–171)** — the CSS that never fires
```
[data-slot="button"][data-variant="default"] {
  background: var(--primary);
  color: var(--primary-foreground);
  border: 2px solid var(--foreground);
  border-radius: var(--radius);
  box-shadow: 4px 4px 0px var(--foreground);
  transition: all 0.2s ease;
}
```

**File: `src/components/ui/button.tsx` (lines 50–56)** — the attribute that never gets stamped
```
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
```

## Interactive Elements (all required)

- **"Spot the Bug" challenge** (hero visual — `references/interactive-elements.md` → "Spot the Bug Challenge"). Use Fault 1: show the `respErr`/`respJson` snippet and the `result.msg` snippet side by side and ask the learner to find the line that can never run. Reveal explains the `message` vs `msg` mismatch and why no tool catches it (`result` comes back as untyped data from the network — as far as TypeScript is concerned, `result.msg` is a perfectly reasonable thing to ask for).
- **Code ↔ English translation** — at minimum the `respErr`/`respJson` pair. The `data-slot` / `data-variant` pair is the strongest second.
- **Quiz** — 4 questions, debugging style, drawing on all five modules. Suggested angles:
  1. Users report the site "just says generation failed" during traffic spikes, though you know the queue logic exists. Where do you look, and what's the fix? (Answer: the client's `result.msg` check — one word. Not the server, not Gemini.)
  2. A designer swears the Generate button used to have a chunky offset shadow and "someone removed it." What actually happened? (Answer: nobody removed it — it never rendered; the selector needs a `data-variant` attribute the component doesn't stamp.)
  3. You ask an AI assistant to "make the aspect-ratio picker work." What do you need to tell it so it doesn't stop halfway? (Answer: three places — build the control and wire `setAspectRatio`; the client already sends the value; the *server* must actually pass it to Gemini instead of just validating and echoing it. Tests whether they can trace end-to-end.)
  4. Free mode is switched on and the button reads "(undefined)". Which of the three places did someone forget? (Answer: the JSON has it — the `Translations` interface and the mapping in `index.tsx` don't. Ties back to module 2.)
- **Callout boxes** — at least two:
  - *aha!*: **Silence is a symptom.** A branch that never runs, a rule that never matches and a setter that's never called all produce zero errors. Working code and disconnected code look identical from the outside — which is why "it doesn't crash" is not evidence that it works.
  - *for steering AI*: the three sentences that end bug loops — name the **station** ("the client's response handling"), name the **mismatch** ("server sends `message`, client reads `msg`"), name the **fix you want** ("change the client, not the server"). Guesses in, guesses out; specifics in, patches out.
- **Optional extra:** pattern cards for a "tap the walls" checklist the learner can reuse on their own project — *Is this setter ever called? Does the field name on both sides of the network match exactly? Does this CSS selector match anything in the rendered page? Does the label match what the button does? Is this string wired all the way through?*
- **Glossary tooltips** (first use in this module): dead code, unreachable branch, silent failure, CSS selector, attribute, `data-` attribute, TypeScript, type checking, `any`, state setter, toast, session, compiler, refactor, regression.

## Closing (last screen of the last module — write a real ending)

Close the whole course, not just the module. Two or three short beats:
- What they can now do: read a generation end-to-end; tell client from server and know why the key stays put; recognise a rented model behind a written brief; name a design token instead of a hex code; spot a silent disconnection.
- The habit worth keeping: when something looks wrong, name the station before proposing the fix.
- A light send-off pointing back at the real files — `src/app/api/generate-cyberpunk/route.ts`, `src/components/blocks/imagen-wrapper/imagen-client.tsx`, `src/app/theme.css` — as the three worth opening first. No fake "congratulations, you're a developer now."

## Reference Files to Read

- `references/content-philosophy.md` — all of it
- `references/gotchas.md` — all of it
- `references/interactive-elements.md` → "Spot the Bug Challenge", "Code ↔ English Translation Blocks", "Multiple-Choice Quizzes", "Scenario Quiz", "Callout Boxes", "Pattern/Feature Cards", "Glossary Tooltips"
- `references/design-system.md` → "Module Structure", "Syntax Highlighting (Catppuccin-inspired)"

## Connections

- **Previous module:** *The LEGO Box* — the four styling layers (tokens → bridge → Tailwind → Shadcn bricks), `cn()`, `cva` variants, and the `[data-slot="card"]` restyling trick that works. Fault 3 is the same trick failing, so call back to it explicitly.
- **Next module:** none — this is the finale.
- **Tone/style notes:** Accent colour is teal. **Never sneer at the code.** These faults are what every shipped product looks like under a torch, including good ones; the app works and people use it. The posture is a friendly inspector with a clipboard, not a critic. Keep actor names consistent with modules 2–4.
