# Module 4: Following the Money — Credits, Stripe, and the Ledger

> You are writing ONE module of a 7-module course about a real, live web app.
> The app: **charlieandlola.net** — upload a selfie, get a Charlie & Lola cartoon character
> from Google's Gemini AI. Free to try, sign in to download, buy credits for more.
> Next.js 15 + TypeScript + a PostgreSQL database. Payments run through **Stripe**.

### Teaching Arc

- **Metaphor:** **The chequebook register** — that little paper stub in the back of a chequebook
  where you write one line per transaction: *date, description, +£200 / −£35*. The crucial rule:
  **you never rub out the balance and write a new one.** You only ever add a line. The balance
  isn't stored anywhere — it's *calculated* by adding up the lines. That's exactly how credits
  work in this app, and it's why you can always answer "where did my 20 credits go?"
  Secondary metaphor for webhooks (keep it small and separate): **the delivery firm phoning you
  back.** You don't stand at the door guessing; they call when the parcel is actually delivered.
- **Opening hook:** "New accounts get 30 free credits. An image costs 10. So the fourth image is
  where this app has to become a business — and the way it handles money is quietly the most
  carefully-built part of the whole codebase."
- **Key insight:** The credits table is an **append-only ledger**, not a balance. Every grant is a
  positive row, every spend is a negative row, and your balance is the sum. And the moment money
  is actually confirmed is not when you click Pay — it's when **Stripe calls the server back**.
- **"Why should I care?":** Money bugs are the ones that cost real money and real trust. If you ask
  an AI to "add credits", it will almost certainly reach for `UPDATE users SET credits = credits - 10`
  — a single number it overwrites. That works right up until two requests land at the same time,
  or a customer disputes a charge, and then you have no way to reconstruct what happened. Knowing
  to say *"use an append-only ledger, don't overwrite a balance"* is a genuinely senior instruction.

### The Money Story (spine of the module)

**Part 1 — buying.**
1. You click a plan on the pricing page. The browser POSTs `{ product_id, currency, locale }` to
   `/api/checkout`. **Note what it does NOT send: the price.**
2. The server looks the product up in its own pricing file and reads the real price from there.
   (Screen-worthy: if the price came from the browser, anyone could buy the $99 plan for $0.01.)
3. The server creates an **order** row with status `created` and its own order number.
4. The server asks Stripe for a checkout session and gets back a URL. Your browser goes to
   Stripe's page. **Your card details never touch this app's servers.**
5. You pay on Stripe's page.

**Part 2 — the callback (the plot twist).**
6. Stripe redirects your browser back to the app. **This is not proof of payment.** Anyone could
   type that return URL into their address bar.
7. Separately, Stripe's servers send a **webhook** — a POST to `/api/pay/notify/stripe` — saying
   `checkout.session.completed`. That message is cryptographically signed.
8. The server verifies the signature with `constructEventAsync`. If it doesn't verify, it's ignored.
9. `updateOrder()` flips the order from `created` to `paid`… but only if it was `created`.
10. `updateCreditForOrder()` adds a positive ledger row for that order number.

**Part 3 — spending.**
11. Generating an image calls `decreaseCredits()`, which writes a **negative** row.
12. `getUserCredits()` adds every unexpired row together to produce your balance.

### The Two Safety Nets (give these their own screen — this is the best material in the module)

**1. Idempotency.** Stripe may send the same webhook more than once — that's by design, so a
network blip doesn't lose your payment. So the code has to be safe to run twice. It has two guards:

```ts
    // order already paied
    if (order.status === OrderStatus.Paid) {
      return;
    }
```
and, in the credit service:
```ts
    const credit = await findCreditByOrderNo(order.order_no);
    if (credit) {
      // order already increased credit
      return;
    }
```
"Idempotent" is a word worth teaching explicitly: *doing it twice has the same result as doing it
once*. It's a term that will make an AI assistant immediately write better payment code.

**2. Credits expire.** Every credit row has an `expired_at` date, and the balance query only counts
rows that haven't expired yet. New-user credits expire in one year; purchased credits expire at the
end of the billing period. Notice the ordering — `orderBy(asc(credits.expired_at))` — the code
spends the *soonest-to-expire* credits first. That's a deliberate business decision living in code.

### Code Snippets (pre-extracted — use verbatim, do not edit)

**Snippet A — the price comes from the server, never from the browser.**
File: `src/app/api/checkout/route.ts` (lines 31–42)

```ts
    // validate checkout params
    const page = await getPricingPage(locale);
    if (!page || !page.pricing || !page.pricing.items) {
      return respErr("invalid pricing table");
    }

    const item = page.pricing.items.find(
      (item: PricingItem) => item.product_id === product_id
    );

    if (!item || !item.amount || !item.interval || !item.currency) {
      return respErr("invalid checkout params");
    }
```

**Snippet B — verifying that a webhook really came from Stripe.**
File: `src/app/api/pay/notify/stripe/route.ts` (lines 19–37)

```ts
    const sign = req.headers.get("stripe-signature") as string;
    const body = await req.text();
    if (!sign || !body) {
      throw new Error("invalid notify data");
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      sign,
      stripeWebhookSecret
    );

    console.log("stripe notify event: ", event);

    switch (event.type) {
      case "checkout.session.completed": {
        // get checkout session
        const session = event.data.object;
        await handleCheckoutSession(stripe, session);
        break;
      }
```

**Snippet C — the double guard against paying twice.**
File: `src/services/order.ts` (lines 36–59)

```ts
    // order already paied
    if (order.status === OrderStatus.Paid) {
      return;
    }

    // only update order status from created to paid
    if (order.status !== OrderStatus.Created) {
      throw new Error("invalid order status");
    }

    const paid_at = getIsoTimestr();
    await updateOrderStatus(
      order_no,
      OrderStatus.Paid,
      paid_at,
      paid_email,
      paid_detail
    );

    if (order.user_uuid) {
      if (order.credits > 0) {
        // increase credits for paied order
        await updateCreditForOrder(order as unknown as Order);
      }
```

**Snippet D — spending is just writing a negative line.** This is the heart of the ledger idea.
File: `src/services/credit.ts` (lines 111–120)

```ts
    const new_credit: typeof creditsTable.$inferInsert = {
      trans_no: getSnowId(),
      created_at: new Date(getIsoTimestr()),
      expired_at: new Date(expired_at),
      user_uuid: user_uuid,
      trans_type: trans_type,
      credits: 0 - credits,
      order_no: order_no,
    };
    await insertCredit(new_credit);
```

Draw attention to `credits: 0 - credits` — that minus sign *is* the entire spend mechanism.

**Snippet E — the balance is calculated, not stored.**
File: `src/services/credit.ts` (lines 54–60)

```ts
    // Get only valid credits for current balance
    const validCredits = await getUserValidCredits(user_uuid);
    if (validCredits) {
      validCredits.forEach((v) => {
        user_credits.left_credits += v.credits || 0;
      });
    }
```

**Snippet F — the five kinds of ledger entry, and the price list, in one place.**
File: `src/services/credit.ts` (lines 14–26)

```ts
export enum CreditsTransType {
  NewUser = "new_user", // initial credits for new user
  OrderPay = "order_pay", // user pay for credits
  SystemAdd = "system_add", // system add credits
  Ping = "ping", // cost for ping api
  ImageGeneration = "image_generation", // cost for image generation
}

export enum CreditsAmount {
  NewUserGet = 30,
  PingCost = 1,
  ImageGeneration = 10,
}
```

### Real Facts You Can Use

- Real prices from the live pricing file: the featured plan is **Premium, $0.99/month** (`amount: 99`
  — note prices are stored in **cents**, a near-universal convention that avoids decimal rounding
  errors). There are 8 plans in total.
- The pricing page isn't a database table — it's a JSON file per language:
  `src/i18n/pages/pricing/en.json`. Changing a price is editing a text file.
- The app supports two payment companies (Stripe and Creem), chosen by an environment variable
  `PAY_PROVIDER`. Chinese customers get WeChat Pay and Alipay added as payment methods.
- There's also an **affiliate** system: paid orders trigger `updateAffiliateForOrder()` which pays
  a percentage to whoever invited that user.

### Interactive Elements (all required)

- [x] **Code↔English translation** — at least three: Snippet A (price from server), Snippet D
      (the minus sign), and Snippet B or C.
- [x] **Group chat animation** — the hero interaction. Participants: **Browser**, **Server**,
      **Stripe**. Script roughly:
      Browser: "I'd like the Premium plan." Server: "Let me look up what that actually costs — I'm
      not taking your word for it. $0.99. Creating order #7429, status: created."
      Server → Stripe: "Set me up a checkout for $0.99, and tag it with order 7429."
      Stripe: "Here's a payment page. Send them over." Browser: *pays on Stripe's page*
      Stripe → Server (later, unprompted): "📩 checkout.session.completed for order 7429. Signed."
      Server: "Signature checks out. Order was 'created' → now 'paid'. Adding +1000 credits."
      Stripe: "📩 checkout.session.completed for order 7429." (again!)
      Server: "Already paid. Ignoring." ← land the idempotency punchline here.
- [x] **Data flow animation** — the credits ledger: show rows accumulating
      (`+30 new_user`, `−10 image_generation`, `−10 image_generation`, `+1000 order_pay`,
      `−10 image_generation`) and the balance being computed by summing them, not stored.
- [x] **Quiz** — 4 questions, scenario style:
      1. "A customer pays, then closes the tab before the page redirects back. Do they get their
         credits?" (Correct: yes — the webhook is a separate message from Stripe's servers to
         yours and doesn't depend on the customer's browser at all.)
      2. "Stripe accidentally sends the same 'payment complete' message twice. What stops the
         customer getting double credits?" (Correct: the order status guard and the
         `findCreditByOrderNo` check — the operation is idempotent.)
      3. "An AI assistant suggests storing a single `credits` number on the users table and
         subtracting from it. Name one thing that gets worse." (Correct: you lose the history — you
         can't answer 'where did my credits go?', can't expire credits selectively, and two
         simultaneous requests can overwrite each other.)
      4. "Someone edits the request in their browser to send `amount: 1` instead of the real price.
         What happens?" (Correct: nothing — the browser never sends the price; the server looks it
         up. Use the wrong answers to teach *never trust the client with anything that matters*.)
- [x] **Glossary tooltips** — aggressive. At minimum: webhook, Stripe, checkout session, ledger,
      idempotent, transaction, row, table, signature/cryptographic signature, environment variable,
      subscription, one-time payment, `POST`, JSON, cents, metadata, redirect, status, enum,
      affiliate, expire, database query.
- [x] **Callout boxes** — one "aha" on *never overwrite a balance, always append a line*; one
      warning on *the redirect back to your site is not proof of payment — the webhook is*.

### Screens (aim for 6)

1. **The chequebook register** — the metaphor, and the reveal that there is no balance column.
2. **Buying: the price does not come from the browser** — Snippet A + the "never trust the client"
   callout.
3. **The plot twist: webhooks** — the delivery-firm-calls-you-back idea, Snippet B, and the group
   chat animation as hero.
4. **Doing it twice safely** — idempotency, Snippet C, the punchline from the chat.
5. **Spending** — Snippet D, Snippet E, the ledger animation, expiry and spend-soonest-first.
6. **The whole picture** — Snippet F (all five entry types, the price list in one place), quiz.

### Reference Files to Read

- `references/content-philosophy.md` — all of it.
- `references/gotchas.md` — all of it.
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Multiple-Choice
  Quizzes", "Group Chat Animation", "Message Flow / Data Flow Animation", "Callout Boxes",
  "Glossary Tooltips", "Numbered Step Cards", "Pattern/Feature Cards".
- `references/design-system.md` → "Module Structure", "Color Palette", "Typography".

### Connections

- **Previous module: "Who Are You?"** — sign-in, the session "wristband", `getUserUuid()`, and the
  fact that brand-new accounts are granted 30 credits expiring in a year. It ended by asking what
  happens on the fourth image. Open by answering that.
- **Next module: "Memory and the Outside World"** — the database itself (tables, schema,
  migrations), plus the outside services the app depends on: Google's AI, cloud storage, and the
  key-rotation pool. End by pointing forward: "We've written a lot of rows to a database this
  module without once asking what a database actually *is*, or what happens when it disappears.
  It disappeared. Really. Next module."
- **Tone/style notes:** Accent colour is **vermillion** (warm red-orange). Warm developer-notebook
  feel. Zero jargon without a tooltip. Second person. The learner is a "vibe coder" — builds
  software by instructing AI, no CS background. **Never use a restaurant/kitchen metaphor.**
  Already used elsewhere and off-limits here: photo lab (M1), film production (M2), festival
  wristband (M3). Actor naming across the course: **Browser, Server, Google, Database, Stripe,
  Storage** — capitalised, consistent.
  Your file must contain ONLY `<section class="module" id="module-4"> ... </section>` — no
  `<html>`, `<head>`, `<body>`, `<style>` or `<script>` tags. Write it to
  `courses/general-course/modules/04-following-the-money.html`.
