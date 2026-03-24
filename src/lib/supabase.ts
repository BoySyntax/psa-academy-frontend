// API client for PSA Academy
// This file handles API communication with the PHP backend

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${apiBaseUrl}${endpoint}`);
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  delete: async (endpoint: string) => {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};
