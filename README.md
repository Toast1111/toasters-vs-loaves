# Toasters vs Loaves — Modular (Phase 2)

This project modularizes your game without changing behavior.

## Development

```bash
npm install
npm run dev
```

## Build & GitHub Pages Deployment

### Automatic Deployment

This repository is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**: Go to your repository Settings → Pages → Source, and select "GitHub Actions"
2. **Push to main branch**: The included GitHub Actions workflow will automatically build and deploy your game
3. **Access your game**: After deployment, your game will be available at `https://<username>.github.io/toasters-vs-loaves/`

### Manual Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Configuration

- The `base` path in `vite.config.ts` is set to `/toasters-vs-loaves/` to match the repository name
- The GitHub Actions workflow automatically deploys the built files from the `dist/` directory

## Game Features

- Tower defense style game
- Modular architecture with separate modules for game logic
- TypeScript for type safety
- Vite for fast development and building
