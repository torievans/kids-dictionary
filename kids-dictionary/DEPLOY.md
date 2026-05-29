# Deploying WordWiz to Vercel

## What you need
- A free [Vercel account](https://vercel.com/signup)
- A free [GitHub account](https://github.com) (to host the code)
- An [Anthropic API key](https://console.anthropic.com)

---

## Step 1 — Put the code on GitHub

1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `kids-dictionary`).
2. Upload the contents of this `kids-dictionary` folder to that repository.
   - The easiest way: drag the files into the GitHub web UI after creating the repo.

---

## Step 2 — Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Click **"Import Git Repository"** and select your `kids-dictionary` repo.
3. Vercel will auto-detect it as a Next.js project — leave all settings as default.
4. Before clicking **Deploy**, click **"Environment Variables"** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (starts with `sk-ant-...`)
5. Click **Deploy** — Vercel will build and publish the app in ~1 minute.
6. Your app will be live at a URL like `https://kids-dictionary.vercel.app` 🎉

---

## Running locally (optional)

```bash
cd kids-dictionary
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## File structure

```
kids-dictionary/
├── app/
│   ├── api/
│   │   └── define/
│   │       └── route.js      ← Claude API call lives here
│   ├── globals.css
│   ├── layout.js
│   ├── page.js               ← Main UI
│   └── page.module.css       ← Styles
├── .env.example
├── next.config.mjs
└── package.json
```

---

## Customising

- **Age range / tone:** Edit the prompt inside `app/api/define/route.js`.
- **Colours:** Tweak CSS variables at the top of `app/globals.css`.
- **App name:** Change `"WordWiz"` in `app/layout.js` and `app/page.js`.
