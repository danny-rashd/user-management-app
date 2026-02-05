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
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    return data;
  },
  
  getProfile: async (token) => {
    const response = await fetch(`${API_URL}/user/get_profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(token)
    });
    const data = await response.json();
    return data;
  },
  
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/user/update_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    return data;
  },
  
  getUserCount: async (token) => {
    const response = await fetch(`${API_URL}/user/get_user_count`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return data;
  },
  
  getUsersList: async (token) => {
    const response = await fetch(`${API_URL}/user/user_list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return data;
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_URL}/user/delete_user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid: id })
    });
    const data = await response.json();
    return data;
  }
};

export default api;