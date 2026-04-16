# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page portfolio website for Harish Kakubal Math (hkm.dev). No build system, no package manager, no dependencies to install. All third-party libraries are loaded via CDN.

## Running Locally

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Architecture

Single HTML file (`index.html`) with five sections (About, Skills, Projects, Experience, Contact), linking to external CSS and JS:

- `css/styles.css` — all styles, CSS custom properties define the warm parchment/terracotta palette inspired by Claude/Anthropic design system (`--parchment: #f5f4ed`, `--terracotta: #c96442`, `--near-black: #141413`)
- `js/ring-scene.js` — Three.js WebGL hero background: rotating bronze torus ring with scroll-driven pixelation effect and mouse parallax
- `js/bots-canvas.js` — Canvas 2D IoT network topology in the About section; fixed bot positions with animated data packets and speech bubbles
- `js/typewriter.js` — Cycling typewriter effect for hero subtitle
- `js/animations.js` — GSAP + ScrollTrigger scroll-reveal animations for all sections

Scripts load in order at the bottom of `<body>` (ticker → ring-scene → bots-canvas → typewriter → animations). GSAP and Three.js are loaded in `<head>` via CDN before any scripts run.

## Key Details

- `assets.pdf` is the downloadable resume, linked from the Contact section as `Harish_Kakubal_Resume.pdf`
- Design system follows warm parchment/terracotta editorial aesthetic (Claude/Anthropic-inspired) — Georgia serif for headlines, Inter sans for body, warm neutrals throughout
- Sections alternate between light (parchment `#f5f4ed`) and dark (near-black `#141413`) backgrounds
- The hero canvas (`#ring-canvas`) is `position: fixed` as a full-viewport background behind all content
- `bots-canvas.js` and `ring-scene.js` are both wrapped in IIFEs to avoid polluting global scope
