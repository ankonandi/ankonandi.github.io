# ankonandi.github.io

Personal product-management portfolio. Vite, React, React Router and plain CSS.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # writes dist/ and a 404.html fallback for client-side routes
npm run preview
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` and publishes `dist/` to GitHub Pages.
In the repo settings, set Pages, Build and deployment, Source to **GitHub Actions**.

## Structure

- `src/content/` copy, metrics and links
- `src/pages/` routes
- `src/layout/` page shell
- `src/styles/` design tokens and layout CSS
- `design/` design mockups
