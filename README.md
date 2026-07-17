# aurimas-frontend

Personal portfolio site for **Aurimas Aleksandras Nausėdas** — AI Architect, Engineer & Product Engineer.
Live at [aurimas.io](https://aurimas.io). Deployed on Vercel.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router v7
- Supabase (newsletter/blog persistence, optional)
- Stripe (publishable key only, payments handled server-side)

## Scripts

```bash
npm install
npm run dev         # local dev server (http://localhost:5173)
npm run build       # production build → dist/
npm run preview     # preview the production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
```

## Configuration

Copy `.env.example` to `.env` and fill in any keys you need locally. The
Stripe publishable key is safe to commit (it's the public key used by the
browser SDK). Supabase keys are optional — the site falls back to
`localStorage` when they're missing.

## Deployment

Vercel auto-deploys from `main`. See `vercel.json` for SPA rewrite, asset caching, and security headers.
