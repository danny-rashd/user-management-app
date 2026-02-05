// API helper functions - PORT 5001
const API_URL = 'http://localhost:8080';

const api = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/user/register_user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    return data;
  },
  
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/register_user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    return data;
  },
  
  getProfile: async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return data;
  },
  
  updateProfile: async (token, profileData) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    return data;
  },
  
  getUserCount: async (token) => {
    const response = await fetch(`${API_URL}/users/count`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return data;
  },
  
  getUsersList: async (token) => {
    const response = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return data;
  }
};

export default api;