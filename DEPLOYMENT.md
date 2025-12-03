# Deployment Guide

## Frontend Deployment (Vercel)

**URL**: https://sheryyll-blog-app2.vercel.app/

### Environment Variables
In your Vercel project settings, add:
```
REACT_APP_API_URL=https://sheryyll-blog-app2.onrender.com
```

### Build Settings
- Framework Preset: Create React App
- Build Command: `npm run build`
- Output Directory: `build`

## Backend Deployment (Render)

**URL**: https://sheryyll-blog-app2.onrender.com

### Environment Variables
In your Render dashboard, add:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

### Build & Start Commands
- Build Command: `npm install`
- Start Command: `npm start`

## CORS Configuration

The backend is configured to accept requests from:
- https://sheryyll-blog-app2.vercel.app
- http://localhost:3000 (for local development)
- http://localhost:3001 (for local development)

## Testing the Connection

1. Visit your frontend: https://sheryyll-blog-app2.vercel.app/
2. Open browser console (F12)
3. Check for any CORS errors
4. Try creating a post to verify the connection

## Troubleshooting

### CORS Errors
- Ensure your frontend URL is added to the CORS origins in `backend/server.js`
- Check that environment variables are set correctly in both Vercel and Render

### API Connection Issues
- Verify the backend is running: https://sheryyll-blog-app2.onrender.com/api/health
- Check browser console for specific error messages
- Ensure MongoDB connection string is correct in Render environment variables

