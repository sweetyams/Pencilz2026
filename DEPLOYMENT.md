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

### 2. Choose Your Database (Pick One)

The database adapter supports multiple backends. Choose the one that fits your needs:

#### Option A: Upstash Redis via Vercel (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project → **Integrations**
3. Search for **Upstash Redis**
4. Click **Add Integration** and follow setup

Environment variables added automatically:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

#### Option B: Vercel KV (Legacy)

1. Go to your project → **Storage** tab
2. Click **Create Database** → Select **KV**
3. Name it and create

Environment variables added automatically:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

#### Option C: Custom Redis Server

Add these environment variables in Vercel:

```
REDIS_URL=redis://your-redis-server:6379
```

Works with:
- Redis Labs
- AWS ElastiCache
- DigitalOcean Redis
- Any Redis-compatible server

#### Option D: No Database (Development Only)

Skip database setup - uses JSON files (data won't persist on Vercel)

### 3. Install Required Packages

```bash
# For Vercel KV / Upstash (Options A & B)
npm install @vercel/kv

# For custom Redis (Option C)
npm install redis

# Or install both
npm install @vercel/kv redis
```

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
The database adapter automatically detects and uses (in order of priority):

1. **Upstash Redis** (via Vercel Integration) - if `UPSTASH_REDIS_REST_URL` exists
2. **Vercel KV** (legacy) - if `KV_REST_API_URL` exists
3. **Custom Redis** - if `REDIS_URL` exists
4. **File System** (fallback) - not recommended for production

## Environment Variables

### Local (.env.local)
```
# Option A: Upstash Redis
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token

# Option B: Vercel KV
KV_REST_API_URL=your_url
KV_REST_API_TOKEN=your_token

# Option C: Custom Redis
REDIS_URL=redis://your-server:6379
```

### Vercel Dashboard
Environment variables are automatically configured when you add the integration.

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
