import API_BASE_URL from '../config';

// Helper function to make API calls with better error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Making API call to:', url); // Debug log
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    }); // Debug log

    // Check content type before parsing
    const contentType = response.headers.get('content-type') || '';
    
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response received:', {
        url,
        status: response.status,
        contentType,
        preview: text.substring(0, 500)
      });
      
      // Provide helpful error message
      if (text.includes('<!doctype') || text.includes('<!DOCTYPE')) {
        throw new Error(
          `Received HTML instead of JSON. This usually means:\n` +
          `1. Backend URL is incorrect (check REACT_APP_API_URL)\n` +
          `2. Backend server is not running\n` +
          `3. CORS is blocking the request\n\n` +
          `Current API URL: ${API_BASE_URL}\n` +
          `Request URL: ${url}\n` +
          `Response preview: ${text.substring(0, 200)}`
        );
      }
      
      throw new Error(`Expected JSON but received ${contentType || 'unknown type'}. Status: ${response.status}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call error:', {
      url,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};
