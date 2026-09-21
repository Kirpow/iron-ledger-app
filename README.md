# Iron Ledger — installable app version

This is a installable Progressive Web App (PWA): it can sit on your phone's home screen or run
as its own windowed app on your computer, and it keeps working without
an internet connection once it's loaded once.

What changed from the single-file version:
- **Progress photos now use IndexedDB** instead of `localStorage`. This
  removes the old ~5–10MB ceiling that mostly ate into photo storage
  — the practical limit is now hundreds of MB to a few GB, depending on
  the device and how full its disk is. Everything else (food log,
  workouts, weight, measurements, pantry, shopping list) still uses
  `localStorage`, which is plenty for this kind of small text data.
- Added `manifest.json`, `service-worker.js`, and app icons so the app is
  installable and works offline.


## Run it locally

Browsers block some PWA features (service workers, sometimes IndexedDB)
when you open an HTML file directly via `file://`. Serve it over a tiny
local server instead — one command, nothing to install if you have
Python:

```bash
cd iron-ledger-app
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

(No Python? Node's `npx serve` or VS Code's "Live Server" extension work
the same way.)

## Install it on your phone

**iPhone (Safari):**
1. Open the app at its local or hosted URL in Safari.
2. Tap the Share icon → **Add to Home Screen**.
3. It now has its own icon and opens full-screen, no browser chrome.

**Android (Chrome):**
1. Open the app in Chrome.
2. Tap the **⋮** menu → **Install app** (or Chrome may prompt you
   automatically).

## Install it on your computer

Open the app in Chrome or Edge — look for an install icon (a little
monitor with a down arrow) in the address bar, or the **⋮** menu →
**Install Iron Ledger**. It becomes a real windowed app with its own
icon in your dock/taskbar, separate from your browser.

## Hosting it somewhere permanent

Running `python3 -m http.server` only works while that command is
running on your computer. For something that's always available (so you
can install it once and forget about the terminal), put these same
files on any static host:

- **Netlify** or **Vercel** — drag-and-drop the folder in their web
  dashboard, get a URL in under a minute, free for this kind of use.
- **GitHub Pages** — push this folder to a repo, turn on Pages in
  settings.

Whichever you pick, install the app from *that* URL instead of
localhost, and it'll keep working from your home screen even after you
close the terminal.

## Data & privacy

Everything still lives only on your device — nothing in this app talks
to a server. Installing it as a PWA doesn't change that; it's still the
exact same local storage and IndexedDB, just wrapped so it feels like a
native app. Uninstalling the app removes its icon but the underlying
browser data may persist until you clear site data for it — same as any
other installed PWA.


