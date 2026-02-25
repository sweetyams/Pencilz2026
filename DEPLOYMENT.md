# Deployment Guide

## Quick Deploy

```bash
# Deploy to production
npm run deploy

# Deploy preview
npm run deploy:preview
```

## Setup Instructions

### 1. Vercel Project Setup

The project is already linked to Vercel. If you need to re-link:

```bash
vercel link
```

### 2. Enable Upstash Redis (Database)

For persistent data storage on Vercel:

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Integrations** tab
3. Search for **Upstash Redis**
4. Click **Add Integration**
5. Follow the setup wizard
6. Select your project

Vercel will automatically add the required environment variables:
- `KV_REST_API_URL` (or `UPSTASH_REDIS_REST_URL`)
- `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_TOKEN`)

### 3. Install Redis Package

```bash
npm install @vercel/kv
```

Note: @vercel/kv works with Upstash Redis integration.

### 4. Deploy

```bash
npm run deploy
```

## How It Works

### Local Development
- Uses JSON files in `public/data/` for storage
- Run `npm run server` for API
- Run `npm run dev` for frontend

### Production (Vercel)
- Uses Vercel KV (Redis) for persistent storage
- Serverless functions handle API requests
- Static files served from CDN

## Environment Variables

### Local (.env.local)
```
# Automatically created by Vercel CLI
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_token
KV_REST_API_READ_ONLY_TOKEN=your_read_token
```

### Vercel Dashboard
All environment variables are automatically configured when you create the KV database.

## File Uploads

**Important:** File uploads on Vercel are temporary. For production, consider:

1. **Vercel Blob Storage** (Recommended)
   ```bash
   npm install @vercel/blob
   ```

2. **Cloudinary** (Image hosting)
3. **AWS S3** (Object storage)

## Deployment Workflow

1. Make changes locally
2. Test with `npm run dev` and `npm run server`
3. Commit changes: `git add -A && git commit -m "message"`
4. Push to GitHub: `git push origin main`
5. Vercel automatically deploys from GitHub
6. Or manually deploy: `npm run deploy`

## Troubleshooting

### Database not persisting
- Ensure Vercel KV is created and linked
- Check environment variables in Vercel dashboard
- Verify `@vercel/kv` is installed

### Build fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` configuration

### API not working
- Check `api/index.js` is properly configured
- Verify CORS settings in production
- Check Vercel function logs

## Monitoring

- **Logs**: Vercel Dashboard → Your Project → Logs
- **Analytics**: Vercel Dashboard → Your Project → Analytics
- **Performance**: Vercel Dashboard → Your Project → Speed Insights
