# Random Aesthetic Generator

A fully static, accessible web application that generates cohesive **color palettes** and **font pairings** for design inspiration. Built without frameworks or build tools — just HTML, CSS, and JavaScript.

---

## Features

* **Randomized palettes**: Generates 3–6 color swatches with HEX values.
* **Font pairings**: Dynamically loads curated Google Font pairs (heading + body) and renders them in a live preview.
* **Contrast checks**: WCAG AA contrast badges for each swatch (vs. black and white).
* **Interactive controls**:

  * Shuffle fonts + colors (`Space` key or button).
  * Save favorites (`S` key or button).
  * Copy CSS variables (`C` key or button).
  * Export JSON of the current combination.
* **Customization**:

  * Color picker to influence the palette’s base hue.
  * Saturation slider.
  * Swatch count selector (3–6).
  * Option to lock the chosen base color as the first swatch.
* **Favorites panel**:

  * Save, re-apply, and delete combinations.
  * Stored in localStorage (`aesthetic.favorites`).
* **Exporting**:

  * Copy CSS variables block.
  * Download/Copy JSON representation.
* **UI Previews**:

  * Font sample: Heading, paragraph, and button preview.
  * Color UI sample: Header, chip, buttons, and link using the generated palette.
* **Light/Dark theme toggle** (persists in localStorage under `aesthetic.settings`).
* **Accessibility**:

  * Semantic HTML, ARIA labels, focus states, keyboard navigation.
  * Respects `prefers-reduced-motion`.

---

## Keyboard Shortcuts

* **Space**: Shuffle fonts + colors
* **S**: Save to favorites
* **C**: Copy CSS variables

*(Shortcuts banner is visible on desktop, hidden on mobile.)*

---

## Project Structure

* **index.html** – Single file containing HTML, inline CSS, and inline JS.
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

* Google Fonts dynamically injected for each pairing (only loads what’s needed).
* Small curated set of serif + sans fonts (≈96 possible pairings).
* Color palettes generated in HSL space, adjusted by base color and saturation bias.
* WCAG AA contrast computed per swatch against black and white.

---

## License

MIT License. Free to use, modify, and distribute.

---

## Credits

Built as a showcase for polished, accessible, front-end engineering and UX design practices. Designed to demonstrate **range and attention to detail** for recruiters, hiring managers, and design/development peers.
