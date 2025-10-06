# Palette & Font Kit

A fully static, accessible web application that generates cohesive **color palettes** and **font pairings** for design inspiration. Built with plain HTML, CSS, and JavaScript — no frameworks or build tools.

---

## Features

* Randomized palettes: Generates 3–6 color swatches with HEX values.
* Font pairings: Dynamically loads curated Google Font pairs (heading + body) and renders them in a live preview.
* Contrast checks: Badges show contrast vs white (W) and black (B), rounded to 1 decimal with pass/fail at AA threshold.
* Unified live preview: A single preview combines sample typography with practical UI elements (header, chip, buttons, link) using your palette and fonts.
* Interactive controls:
  * Shuffle All (fonts + colors) — Space key or button.
  * Shuffle Colors — button.
  * Shuffle Font — button.
  * Save favorites — S key or button.
  * Copy CSS variables — C key or button.
  * Export JSON — button.
* Customization:
  * Base color picker to influence the palette’s hue; optional “Use as first swatch”.
  * Saturation slider that adjusts only the current palette’s saturation (hue/lightness preserved from the baseline).
  * Swatch count selector (Auto 4–6, or 3–6 fixed).
* Favorites panel:
  * Save, re-apply, and delete combinations.
  * “Clear All” button at the top-right of the panel.
  * Stored in localStorage under `aesthetic.favorites`.
* Exporting:
  * Copy a CSS variables block for quick theming.
  * Download or copy a JSON representation of the current combo.
* Light/Dark theme toggle (persists in localStorage under `aesthetic.settings`).
* Accessibility:
  * Semantic HTML, ARIA labels, focus-visible outlines, keyboard navigation.
  * Respects `prefers-reduced-motion`.

---

## Keyboard Shortcuts

* **Space**: Shuffle fonts + colors
* **S**: Save to favorites
* **C**: Copy CSS variables

*(Shortcuts banner is visible on desktop, hidden on mobile.)*

---

## Project Structure

* **index.html** – Markup and layout; loads external CSS/JS.
* **styles.css** – All styles, including responsive layout and preview UI.
* **script.js** – App logic (palette generation, fonts, favorites, exports).
* **favicon.png** – App icon for GitHub Pages and browser tabs.

---

## Local Development

1. Clone or download this repository.
2. Open `index.html` in any modern browser.
3. No build tools or server required.

---

## Deployment

* Works as a static site (GitHub Pages, Netlify, Vercel, etc.).
* Ensure `favicon.png` is in the project root.

---

## Tech Notes

* Google Fonts are injected on the fly via a dedicated `<link>` element (`#gf-dynamic`), loading only what’s needed.
* Curated serif/sans pairs plus lightweight random pairing for variety.
* Palettes are generated in HSL space from a base hue with optional saturation bias.
* The saturation slider modifies only saturation relative to a baseline, preserving the palette’s hue/lightness.
* WCAG contrast is computed for each swatch vs black and white; badges display a rounded ratio and pass/fail state.

---

## License

MIT License. Free to use, modify, and distribute.

---

## Credits

Built as a showcase for polished, accessible, front-end engineering and UX design practices. Designed to demonstrate **range and attention to detail** for recruiters, hiring managers, and design/development peers.
