const API_BASE_URL = window.location.origin.includes('5173') ? 'http://localhost:5000/api' : '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('campushub_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  get: (url, params) => {
    let query = '';
    if (params) {
      const filteredParams = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '');
      if (filteredParams.length > 0) {
        query = '?' + new URLSearchParams(filteredParams).toString();
      }
    }
    return request(url + query, { method: 'GET' });
  },

  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),

  put: (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (url) => request(url, { method: 'DELETE' })
};

export default api;
