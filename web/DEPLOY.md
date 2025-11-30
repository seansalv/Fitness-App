# Deploying Hero Arc Web Demo to Vercel

## Quick Deploy (Recommended)

### Step 1: Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
cd web
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Choose your account)
- Link to existing project? **No** (for first deploy)
- Project name? (e.g., `hero-arc-demo`)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 3: Production Deploy
```bash
vercel --prod
```

## Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure:
   - **Root Directory**: `web`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Click **Deploy**

## Custom Domain (Optional)

After deployment:
1. Go to your project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain (e.g., `heroarc.yourportfolio.com`)
4. Follow DNS configuration instructions

## Environment Variables

If you add backend integration later, add environment variables in:
- Vercel Dashboard → Project Settings → Environment Variables
- Or via CLI: `vercel env add VARIABLE_NAME`

## Troubleshooting

- **Build fails**: Make sure `npm install` runs successfully in the `web/` directory
- **404 on routes**: Vite SPA routing should work automatically with Vercel
- **Assets not loading**: Check that `dist/` contains all built files

