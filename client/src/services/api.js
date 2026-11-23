// Centralized API Service Client for RK Nutrition Dual-Admin System

const getNormalizedApiBase = () => {
  let envBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
    ? String(import.meta.env.VITE_API_URL).trim()
    : '';

  if (!envBase) {
    return '/api';
  }

  // Strip trailing slashes
  envBase = envBase.replace(/\/+$/, '');

  // If base does not end with /api, ensure /api is appended so all backend routes match
  if (!envBase.endsWith('/api')) {
    envBase = `${envBase}/api`;
  }

  return envBase;
};

const API_BASE = getNormalizedApiBase();

export const getAuthToken = () => {
  return localStorage.getItem('rk_auth_token') || '';
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('rk_auth_token', token);
  } else {
    localStorage.removeItem('rk_auth_token');
  }
};

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, delete Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const res = await fetch(`${API_BASE}${cleanEndpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const defaultError = res.status === 404
        ? 'Service endpoint not found (404). Please verify your connection or try again.'
        : `Request failed with status ${res.status}`;
      return {
        success: false,
        status: res.status,
        error: data.error || defaultError
      };
    }

    return {
      success: true,
      status: res.status,
      ...data
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      error: err.message || 'Network connection to server failed.'
    };
  }
}

// Upload file helper
export async function uploadFile(file) {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || 'Upload failed.' };
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message || 'File upload network error.' };
  }
}
