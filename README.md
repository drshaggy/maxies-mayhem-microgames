# Maxie's Mayhem — Microgames

Community microgames for **[Maxie's Mayhem](https://drshaggy.vercel.app/maxies-mayhem/)**, a WarioWare-style microgame game. Each microgame is one tiny challenge — a one-word command and ~4 seconds to clear it.

This repo is the home for community submissions. It's pulled into the live game as a git submodule, so a merged game ships the next time the site is deployed.

## Contribute a microgame

1. Fork this repo.
2. Add `your-game.js` in the root and register it in `index.js`. See **[SDK.md](SDK.md)** for the full API.
3. Test it locally (below) — make sure it's winnable at difficulty 1 **and** 3, and plays fairly on a trackpad.
4. Open a PR. Once merged and pulled into the site, it's in the rotation.

## Run the dev playground

No build step — it's plain ES modules.

```bash
npx serve .
```

Open the printed URL at **`/dev/`**. Pick any game from the list and play it with mouse, touch, or keyboard. Use the difficulty buttons to check it stays fair as it ramps.

## Layout

```
your-game.js      one microgame per file (import the SDK from 'maxie-sdk')
index.js          the registry — every game is imported + listed here
SDK.md            the authoring guide / API reference
dev/              local playground (a vendored SDK snapshot lives here; dev-only)
```

The SDK (`defineMicrogame`, the `g` context, Maxie) is owned by the host game. The `dev/` copy is a snapshot just so this repo runs standalone; the live site always supplies the real, current SDK via an import map.
