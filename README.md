# Annotation review tool

A lightweight internal tool for building spacious, annotated product reviews. Drop in scrappy mobile screenshots, add a feedback point, and publish a scrollable review page with left-aligned notes connected to the exact UI moment via horizontal callout lines.

Built for Sierra design and product reviews.

## Workflow

1. Add a normalized screenshot to `public/` (512×1016 canvas, 432×936 panel, 40px equal padding).
2. Add a review section in `index.html` with your feedback copy.
3. Set callout position in `styles.css` via `--callout-y` and `--callout-target-x` on the screenshot class.
4. Run locally or build for share.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Local dev: [http://localhost:5173/](http://localhost:5173/)

## Annotation pattern

Each section includes:

- Index and title
- Left annotation (label + refined feedback)
- Screenshot with horizontal 1px callout line and circular endpoint
- Text vertically centered on the line; endpoint sits 12px before the referenced UI element

## Normalizing scrappy screenshots

Screenshots should be cropped to the mobile panel and normalized to:

- **Canvas:** 512×1016
- **Panel:** 432×936
- **Padding:** 40px on all sides

Figma or browser chrome can be stripped before drop-in. Mismatched source sizes are scaled to the standard panel so every mock aligns in the layout.

## Project structure

```
index.html      Review sections and annotations
styles.css      Layout, callout system, responsive rules
public/         Normalized review screenshots
vite.config.js  Static asset serving via Vite public dir
```
