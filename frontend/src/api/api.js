// API helper functions - PORT 5001
let API_URL = 'http://localhost:8080';
if (window.location.hostname !== "localhost") {
     API_URL = window.location.protocol + "//" + window.location.hostname + "/um";

}


const api = {
    register: async (userData) => {
        const response = await fetch(`${API_URL}/user/register_user`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/admin_login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        });
        return await response.json();
    },

    getProfile: async (token) => {
        const response = await fetch(`${API_URL}/user/get_profile`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(token)
        });
        return await response.json();
    },

    updateProfile: async (profileData) => {
        const response = await fetch(`${API_URL}/user/update_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        });
        return await response.json();
    },

    getUserCount: async (token) => {
        const response = await fetch(`${API_URL}/user/get_user_count`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        return await response.json();
    },

    getUsersList: async (token) => {
        const response = await fetch(`${API_URL}/user/user_list`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        return await response.json();
    },

    deleteUser: async (id) => {
        const response = await fetch(`${API_URL}/user/delete_user`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uuid: id})
        });
        return await response.json();
    },

    getRanks: async () => {
        try {
            const response = await fetch(`${API_URL}/lov/get_ranks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch ranks');
            }

            const result = await response.json();

            if (result.status === 'OK') {
                return result.data; // Return the data array
            } else {
                throw new Error(result.description);
            }
        } catch (error) {
            console.error('Error fetching ranks:', error);
            throw error;
        }
    },

    getRoles: async () => {
        try {
            const response = await fetch(`${API_URL}/lov/get_roles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const result = await response.json();

            if (result.status === 'OK') {
                return result.data; // Return the data array
            } else {
                throw new Error(result.description);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    },

};

export default api;