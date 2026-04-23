# Vercel Deployment Instructions

Your EleSquad application is now configured for Vercel deployment!

### 1. Prerequisites
- Install Vercel CLI: `npm install -g vercel`
- Login: `vercel login`

### 2. Environment Variables
You MUST set the following environment variable in the Vercel Dashboard (Settings > Environment Variables):
- `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb+srv://...`)
- `NODE_ENV`: `production`

### 3. Deploy
Run the following command in your project root:
```bash
vercel --prod
```

### Note on Socket.io
Vercel Serverless Functions have a timeout and don't maintain persistent connections. While I've configured the rewrites, Socket.io may fallback to long-polling or experience disconnections. For a production-ready real-time experience, consider hosting the backend on a provider that supports persistent connections (like Heroku or DigitalOcean) or using a dedicated WebSocket service like Pusher.
