# PartyHub

PartyHub is a Vite + React (TypeScript) web app that bundles a collection of fast-paced, social party games. This repo contains the full front-end, including UI components from shadcn/ui and Tailwind CSS styling utilities.

## Getting Started

### Requirements

- Node.js 18+
- npm 9+

### Installation

```bash
git clone <YOUR_GIT_URL>
cd PartyHub
npm install
npm run dev
```

The development server defaults to <http://localhost:8080>. Vite will hot-reload as you edit files under `src/`.

### Available Scripts

- `npm run dev` – start the Vite dev server.
- `npm run build` – create a production build in `dist/`.
- `npm run preview` – serve the production build locally.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS & shadcn/ui
- TanStack Query, Radix UI primitives, and assorted utilities listed in `package.json`

## Deployment

Build the project with `npm run build` and host the generated `dist/` directory on any static host (e.g., Vercel, Netlify, Cloudflare Pages, or your own server). Configure your host to serve `index.html` for unknown routes to support client-side routing.

## Contributing

1. Create a new branch for your feature or fix.
2. Make changes and ensure lint/tests pass.
3. Open a pull request describing the update.

## License

Provide your preferred license here. Remove or update this section if licensing is managed elsewhere.
