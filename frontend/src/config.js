// API Configuration
// IMPORTANT: Set REACT_APP_API_URL in your Vercel environment variables
// For Render backend: https://sheryyll-blog-app2.onrender.com
// For local development: http://localhost:5000
// 
// If your backend is on Vercel, it should be: https://sheryyll-blog-app2.vercel.app
// But note: Vercel requires serverless functions in /api folder for backend

const getApiUrl = () => {
  // Check environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Default to Render (most common for Express backends)
  return 'https://sheryyll-blog-app2.onrender.com';
};

const API_BASE_URL = getApiUrl();

console.log('API Base URL:', API_BASE_URL); // Debug log
console.log('Environment:', process.env.NODE_ENV); // Debug log

export default API_BASE_URL;

