const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const ACCESS_TOKEN_KEY = 'parahive.accessToken';
const REFRESH_TOKEN_KEY = 'parahive.refreshToken';

async function request(path, { accessToken, body, method = 'GET' } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'API request failed.');
  }

  return data;
}

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setStoredTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearStoredTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const apiClient = {
  auth: {
    changePassword: (accessToken, body) => request('/auth/change-password', { method: 'POST', accessToken, body }),
    login: (body) => request('/auth/login', { method: 'POST', body }),
    logout: (accessToken) => request('/auth/logout', { method: 'POST', accessToken }),
    me: (accessToken) => request('/auth/me', { accessToken }),
    refresh: (refreshToken) => request('/auth/refresh', { method: 'POST', body: { refreshToken } }),
  },
  pilots: {
    list: (accessToken, query = '') => request(`/pilots${query}`, { accessToken }),
    get: (accessToken, id) => request(`/pilots/${id}`, { accessToken }),
    updateProfile: (accessToken, id, body) => request(`/pilots/${id}/profile`, { method: 'PATCH', accessToken, body }),
  },
  profile: {
    me: (accessToken) => request('/profile/me', { accessToken }),
    updateMe: (accessToken, body) => request('/profile/me', { method: 'PATCH', accessToken, body }),
  },
  users: {
    create: (accessToken, body) => request('/users', { method: 'POST', accessToken, body }),
    list: (accessToken, query = '') => request(`/users${query}`, { accessToken }),
    resetPassword: (accessToken, id, body) => request(`/users/${id}/reset-password`, { method: 'POST', accessToken, body }),
    update: (accessToken, id, body) => request(`/users/${id}`, { method: 'PATCH', accessToken, body }),
    updateBlock: (accessToken, id, body) => request(`/users/${id}/block`, { method: 'PATCH', accessToken, body }),
    updateRole: (accessToken, id, body) => request(`/users/${id}/role`, { method: 'PATCH', accessToken, body }),
  },
};
