# Hero Arc Web Demo

A browser-based demo of the Hero Arc fitness app, built with React, Vite, and Tailwind CSS.

## Local Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Deploy to Vercel

### Option 1: Deploy from web directory

1. Navigate to the `web/` directory
2. Run `vercel` (or connect via Vercel dashboard)
3. Vercel will auto-detect the Vite project

### Option 2: Deploy from monorepo root

1. In Vercel dashboard, set:
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

2. Or use `vercel.json` in the root (if deploying entire monorepo)

### Option 3: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure:
   - **Root Directory**: `web`
   - **Framework Preset**: Vite
   - Vercel will auto-detect the rest

## Build Output

The production build outputs to `dist/` and can be served as static files.

## Environment Variables

Currently no environment variables are required for the demo. If you add Supabase integration later, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

