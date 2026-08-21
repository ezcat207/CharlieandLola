# Module 3: Who Are You? — Sign-In, Sessions, and Trust

> You are writing ONE module of a 7-module course about a real, live web app.
> The app: **charlieandlola.net** — upload a selfie, get a Charlie & Lola cartoon character
> from Google's Gemini AI. Free to try, sign in to download, buy credits for more.
> Next.js 15 + TypeScript. Sign-in is handled by a library called NextAuth.

### Teaching Arc

- **Metaphor:** **The music-festival wristband.** At the gate you queue up once and prove who you
  are the hard way — passport, booking reference, a good look at your face. In exchange you get a
  paper wristband. After that, nobody at any stage, bar or backstage door checks your passport
  again; they glance at the wristband. The wristband is **tamper-evident** — you can't peel it off
  and pass it to a friend without it showing. And it **expires** at the end of the weekend.
  The gate = the sign-in flow. The wristband = the session cookie holding a signed token.
  "Show me your wristband" = `getUserUuid()`. Use gate/wristband/stages throughout.
- **Opening hook:** "You can use this app without signing in. You just can't *download*. The moment
  the app cares about who you are is the moment all of this machinery switches on — and it's the
  same machinery in almost every app you've ever used."
- **Key insight:** Proving who you are is **expensive and happens once**; *remembering* who you are
  is **cheap and happens on every single request**. Those are two different jobs, and confusing
  them is where most auth bugs come from. Also: this app never stores your Google password. It
  never sees it.
- **"Why should I care?":** Auth is the #1 thing AI assistants get subtly wrong, because it's the
  one place where "it works on my machine" and "it's secure" are different questions. If you can
  read a sign-in flow, you can spot the classic disasters: trusting data the browser sent you,
  checking permissions in the browser instead of the server, or storing passwords in plain text.

### The Story of a Sign-In (spine of the module)

1. You click "Sign in with Google". Your browser goes **to Google**, not to this app.
2. You log in *at Google*. This app never sees your password. Google asks "do you want to share
   your email and name with charlieandlola.net?"
3. Google sends your browser back to the app with a signed slip of paper proving "this is
   ruoyu@example.com, and I, Google, vouch for it."
4. NextAuth's `jwt` callback fires. This is the app's one chance to do something with that fact.
5. It calls `handleSignInUser()`, which builds a user record and calls `saveUser()`.
6. `saveUser()` checks the database. **New email? Create the account and give them 30 free credits,
   expiring in one year.** Existing email? Just load the existing record.
7. The user's `uuid`, email, nickname and avatar get packed into the **token** — the wristband.
8. That token is stored in a cookie in your browser. Every future request carries it automatically.
9. On any later request, `getUserUuid()` reads the wristband and returns your id — or an empty
   string, which is how the app knows you're a guest.

### Three Doors Into the Same Building

The app supports several sign-in methods, and every one of them lands in the same place (step 4
above). Present these as cards:
- **Google** (standard OAuth redirect)
- **GitHub** (standard OAuth redirect)
- **Google One Tap** (the little "Continue as…" bubble that appears top-right — it hands over a
  token which the server verifies by calling Google's `tokeninfo` endpoint)
- **Email + password** (only if switched on) — the app *does* store a password here, but as a
  **hash**, never the password itself.
- **API key** — for developers calling the app programmatically. A key starting with `sk-`.

The clever bit: none of these providers are hard-coded on. Each one only exists if the matching
environment variables are set. Look at the `if` around each provider — the list of sign-in buttons
on the page is literally computed from the server's configuration at startup.

### Code Snippets (pre-extracted — use verbatim, do not edit)

**Snippet A — a sign-in method only exists if it's configured.**
File: `src/auth/config.ts` (lines 132–144)

```ts
// Google Auth
if (
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" &&
  process.env.AUTH_GOOGLE_ID &&
  process.env.AUTH_GOOGLE_SECRET
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}
```

**Snippet B — the wristband gets printed. This is the hinge of the whole module.**
File: `src/auth/config.ts` (lines 208–228)

```ts
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      try {
        if (!user || !account) {
          return token;
        }

        const userInfo = await handleSignInUser(user, account);
        if (!userInfo) {
          throw new Error("save user failed");
        }

        token.user = {
          uuid: userInfo.uuid,
          email: userInfo.email,
          nickname: userInfo.nickname,
          avatar_url: userInfo.avatar_url,
          created_at: userInfo.created_at,
        };

        return token;
      } catch (e) {
```

**Snippet C — new account? Here's 30 free credits.**
File: `src/services/user.ts` (lines 20–38)

```ts
    const existUser = await findUserByEmail(user.email);

    if (!existUser) {
      // user not exist, create a new user
      if (!user.uuid) {
        user.uuid = getUuid();
      }

      console.log("user to be inserted:", user);

      const dbUser = await insertUser(user as typeof users.$inferInsert);

      // increase credits for new user, expire in one year
      await increaseCredits({
        user_uuid: user.uuid,
        trans_type: CreditsTransType.NewUser,
        credits: CreditsAmount.NewUserGet,
        expired_at: getOneYearLaterTimestr(),
      });
```

**Snippet D — "show me your wristband". Every protected action starts here.**
File: `src/services/user.ts` (lines 57–77)

```ts
export async function getUserUuid() {
  let user_uuid = "";

  const token = await getBearerToken();

  if (token) {
    // api key
    if (token.startsWith("sk-")) {
      const user_uuid = await getUserUuidByApiKey(token);

      return user_uuid || "";
    }
  }

  const session = await auth();
  if (session && session.user && session.user.uuid) {
    user_uuid = session.user.uuid;
  }

  return user_uuid;
}
```

Point out the design decision hidden in that empty string: `getUserUuid()` never throws and never
says "unauthorised". It just returns `""` for a guest. That's *why* the app can offer free
generation to logged-out visitors — being a guest isn't an error, it's a state.

**Snippet E — passwords are never stored, only hashes.**
File: `src/auth/config.ts` (lines 41–50)

```ts
          if (!user || !user.password_hash) {
            return null;
          }

          // Verify password
          const isValidPassword = await verifyPassword(password, user.password_hash);

          if (!isValidPassword) {
            return null;
          }
```

A hash is a one-way blender: you can turn "hunter2" into a fingerprint, but you can't turn the
fingerprint back into "hunter2". When you log in, the app blends what you typed and compares
fingerprints. Notice too that a wrong password and a non-existent account both `return null` —
the app doesn't tell an attacker which one it was.

### The Real Gotcha Worth Teaching

`getUserUuid()` reads the session **on the server**. The browser sends the cookie; the server
verifies its signature before believing a single word of it. Contrast this with the tempting
mistake an AI assistant will happily make: reading `session.user.uuid` in a client component and
sending it to the server as a parameter. That means anyone can type someone else's user id into
the request. **Rule: the server never takes the browser's word for who you are.** Make this a
prominent callout — it's the single most valuable security instinct in this module.

### Interactive Elements (all required)

- [x] **Code↔English translation** — at least two: Snippet B (the wristband being printed) and
      Snippet D (the wristband being checked). Snippet C is a strong third.
- [x] **Data flow animation** — the hero visual. Actors: `Browser` → `Google` → `Server` →
      `Database` → `Browser`. Steps: (1) You click "Sign in with Google". (2) Browser is redirected
      to Google — the app never sees your password. (3) Google verifies you and sends the browser
      back with a signed proof. (4) The server's `jwt` callback fires. (5) Server asks the Database:
      "seen this email before?" (6) New user → create record + grant 30 credits. (7) Server packs
      uuid + email + nickname into a signed token. (8) Token is stored as a cookie in your browser.
      Every later request carries it automatically.
- [x] **Quiz** — 3–4 questions, scenario/debugging style:
      1. "Users report they get signed out every time they refresh. Where do you look?" (Correct:
         the cookie/token — is it being set, is it expiring immediately, is `useSecureCookies` on
         over plain HTTP. Wrong: the Google account settings / the database.)
      2. "An AI assistant writes code that reads the user's id in the browser and sends it to the
         server with the request. What's wrong with that?" (Correct: the browser can be edited by
         anyone — you'd be letting a user claim to be someone else. The server must read identity
         from the verified session, not from the request body.) **This is the money question.**
      3. "You add a 'Sign in with GitHub' button but nothing happens in production, though it works
         locally. What's the most likely cause?" (Correct: the environment variables gating that
         provider aren't set on the production server, so the provider was never added to the list.)
      4. "New signups aren't receiving their 30 free credits, but they *can* sign in. Which step of
         the sign-in story failed?" (Correct: the branch inside `saveUser` that runs only for brand
         new emails — e.g. the user already existed under a different provider.)
- [x] **Glossary tooltips** — aggressive. At minimum: authentication, authorisation, OAuth, session,
      cookie, token, JWT, callback, provider, environment variable, hash, `uuid`, redirect,
      endpoint, HTTPS, API key, bearer token, credentials, database record, server-side,
      client-side, plain text.
- [x] **Callout boxes** — one "aha" on *prove once, remember cheaply*; one warning on *the server
      never takes the browser's word for who you are*.
- [x] **Optional if it fits**: a "Spot the Bug" challenge using the client-sends-its-own-user-id
      anti-pattern, or config badges showing which sign-in methods switch on with which env vars.

### Screens (aim for 5)

1. **The wristband metaphor** + the two different jobs (proving vs remembering).
2. **Three doors into the same building** — provider cards + Snippet A (providers are conditional).
3. **The gate** — the sign-in flow animation as hero visual, then Snippet B.
4. **Your first 30 credits** — Snippet C. Sets up Module 4.
5. **Showing the wristband** — Snippet D, the empty-string-means-guest insight, the security
   callout, Snippet E on hashes, then the quiz.

### Reference Files to Read

- `references/content-philosophy.md` — all of it.
- `references/gotchas.md` — all of it.
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Multiple-Choice
  Quizzes", "Message Flow / Data Flow Animation", "Callout Boxes", "Glossary Tooltips",
  "Pattern/Feature Cards", "Permission/Config Badges", "Spot the Bug Challenge".
- `references/design-system.md` → "Module Structure", "Color Palette", "Typography".

### Connections

- **Previous module: "Meet the Cast"** — the folder map, the layer rule (Route → Service → Model →
  Database), and the `'use client'` server/client divide. It ended by noting that the image route
  calls `getUserUuid()` and promised this module would open that box. Open by delivering on that.
- **Next module: "Following the Money"** — credits, Stripe checkout, and the ledger. End by
  pointing forward: "New users get 30 credits. An image costs 10. So what happens on the fourth
  one? That's a payment question — and payments have a plot twist."
- **Tone/style notes:** Accent colour is **vermillion** (warm red-orange). Warm developer-notebook
  feel. Zero jargon without a tooltip. Second person. The learner is a "vibe coder" — builds
  software by instructing AI, no CS background. **Never use a restaurant/kitchen metaphor.**
  Already used elsewhere in the course and off-limits here: photo lab (M1), film production (M2).
  Actor naming across the course: **Browser, Server, Google, Database, Stripe, Storage** —
  capitalised, consistent.
  Your file must contain ONLY `<section class="module" id="module-3"> ... </section>` — no
  `<html>`, `<head>`, `<body>`, `<style>` or `<script>` tags. Write it to
  `courses/general-course/modules/03-who-are-you.html`.
