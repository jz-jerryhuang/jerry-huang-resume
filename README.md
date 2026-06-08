# Jerry Huang — Interactive Résumé

A single-page, interactive résumé website built with plain HTML, CSS, and JavaScript (no build step, no dependencies).

## Structure

```
resume-website/
├── index.html        # All content / markup
├── css/styles.css    # Styling + light/dark themes + responsive
├── js/main.js        # Interactivity (nav, reveal, timeline, counters, particles, form)
└── README.md
```

## Features

- **Hybrid aesthetic** — clean professional layout with subtle tech accents (animated particle network in the hero).
- **Light / dark theme toggle** (top-right ◐), preference saved in `localStorage`. Defaults to dark.
- **Scroll-reveal animations** and **animated stat counters**.
- **Sticky nav** with active-section highlighting and a mobile menu.
- **Expandable experience timeline** — click any role to collapse/expand.
- **Contact cards** — Email (mailto), LinkedIn, and Web3 channel as button-style blocks (URLs are not shown, only the action text).
- Respects `prefers-reduced-motion`.

## Run locally

Just open `index.html` in a browser. For accurate behavior (and to avoid any path issues), serve it:

```bash
# from inside resume-website/
python -m http.server 8000
# then visit http://localhost:8000
```

## Contact section

Contact is presented as three button-style cards in `index.html`:

- **Email** — `mailto:` link, address shown.
- **LinkedIn** — links to the profile; only "Connect with me" is shown, URL is not displayed.
- **Web3 Content Creator Channel** — links to the Instagram channel; only "Follow my channel" is shown.

To edit, update the `href` values in the `.contact__cards` block.

## Deploy

### GitHub Pages
1. Push this folder to a GitHub repo.
2. Settings → Pages → Source: `main` branch, root.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

### Vercel
1. Import the repo at https://vercel.com (or `vercel` CLI).
2. Framework preset: **Other** (it's a static site). No build command needed.
3. Deploy.

## Customize

- **Accent color:** edit `--accent` in `css/styles.css` (`:root`).
- **Theme default:** change `data-theme="dark"` on `<body>` in `index.html`.
- **Content:** all text lives in `index.html`.
