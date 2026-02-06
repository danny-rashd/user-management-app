import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import api from './api/api';
import Select from 'react-select';

// Register Component
function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        rank: null,      // Single select
        role: []         // Multi select
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
    const [rankOptions, setRankOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);

    useEffect(() => {
        // Temporary mock data for ranks
        const mockRanks = [
            { uuid: '1a2b3c4d', code: 'LT', name: 'Lieutenant' },
            { uuid: '2b3c4d5e', code: 'CPT', name: 'Captain' },
            { uuid: '3c4d5e6f', code: 'MAJ', name: 'Major' },
            { uuid: '4d5e6f7g', code: 'LTC', name: 'Lieutenant Colonel' },
            { uuid: '5e6f7g8h', code: 'COL', name: 'Colonel' }
        ];

        // Temporary mock data for roles
        const mockRoles = [
            { uuid: 'a1b2c3d4', code: 'ADM', name: 'Administrator' },
            { uuid: 'b2c3d4e5', code: 'MGR', name: 'Manager' },
            { uuid: 'c3d4e5f6', code: 'USR', name: 'User' },
            { uuid: 'd4e5f6g7', code: 'AUD', name: 'Auditor' },
            { uuid: 'e5f6g7h8', code: 'DEV', name: 'Developer' }
        ];

        // Format ranks
        const formattedRanks = mockRanks.map(rank => ({
            value: rank.uuid,
            label: rank.name,
            code: rank.code
        }));
        setRankOptions(formattedRanks);

        // Format roles
        const formattedRoles = mockRoles.map(role => ({
            value: role.uuid,
            label: role.name,
            code: role.code
        }));
        setRoleOptions(formattedRoles);

        // When API is ready, replace with:
        // const fetchOptions = async () => {
        //   try {
        //     const ranksData = await api.getRanks();
        //     const formattedRanks = ranksData.map(rank => ({
        //       value: rank.uuid,
        //       label: rank.name,
        //       code: rank.code
        //     }));
        //     setRankOptions(formattedRanks);
        //
        //     const rolesData = await api.getRoles();
        //     const formattedRoles = rolesData.map(role => ({
        //       value: role.uuid,
        //       label: role.name,
        //       code: role.code
        //     }));
        //     setRoleOptions(formattedRoles);
        //   } catch (error) {
        //     console.error('Error fetching options:', error);
        //   }
        // };
        // fetchOptions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            return;
        }

        try {
            const { confirmPassword, ...registrationData } = formData;

            // Transform the data for API
            const apiData = {
                ...registrationData,
                rank: registrationData.rank?.value || null,  // Send UUID
                role: registrationData.role?.map(r => r.value) || []  // Send array of UUIDs
            };

            const result = await api.register(apiData);

            if (result.description === 'User registered successfully') {
                setMessage('Registration successful! Redirecting to login...');
                setMessageType('success');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setMessage(result.message || 'Registration failed');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
            setMessageType('error');
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div>
                    <label htmlFor="rank">Rank</label>
                    <Select
                        id="rank"
                        options={rankOptions}
                        value={formData.rank}
                        onChange={(selected) => setFormData({...formData, rank: selected})}
                        placeholder="Select rank..."
                        isClearable
                        isSearchable
                    />
                </div>

                <div>
                    <label htmlFor="role">Role</label>
                    <Select
                        id="role"
                        options={roleOptions}
                        value={formData.role}
                        onChange={(selected) => setFormData({...formData, role: selected})}
                        placeholder="Select roles..."
                        isMulti
                        isClearable
                        isSearchable
                    />
                </div>

                <button type="submit">Register</button>
            </form>
            {message && <p className={`message ${messageType === 'error' ? 'error' : ''}`}>{message}</p>}
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}

// Login Component
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.login(formData);

      if (result.code == 111) {
        localStorage.setItem('token', result.data.uuid);
        localStorage.setItem('user', JSON.stringify(result.data));
        navigate('/dashboard');
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p className="message error">{message}</p>}
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDeleteUUID, setSelectedDeleteUUID] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Fetch user count
        const result = await api.getUserCount(token);

        if (result.code == 111) {
          setUserCount(result.data);
        } else {
          setError('Could not fetch user count');
        }

        // Fetch users list
        const usersResult = await api.getUsersList(token);
        console.log(usersResult)
        if (usersResult.code == 111) {
          setUsersList(usersResult.data);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Error loading dashboard: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p className="message error">{error}</p>
        <button onClick={handleLogout} className="btn logout">Logout</button>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      const result = await api.deleteUser(id);
      if (result.code == 111) {
        setUsersList(usersList.filter((u) => u.uuid !== id));
      }
    } catch (error) {
      console.error('Delete user error:', error);
    }
  };


  return (
      <>
        <DeleteConfirmModal
            open={selectedDeleteUUID.length > 0}
            onCancel={() => setSelectedDeleteUUID('')}
            onConfirm={() => {
              handleDelete(selectedDeleteUUID);
              setSelectedDeleteUUID('');
            }}
        />
        <div className="dashboard-container">
          <div style={{display:"flex", marginBottom: "40px", justifyContent:"space-between"}}>
            <div></div>
            <h2 style={{marginBottom: "0"}}>Dashboard</h2>

            <button onClick={handleLogout} className="btn logout">Logout</button>
          </div>
          {user ? (
              <>
                <div className="user-info">
                  <p><strong>Welcome, {user.name}!</strong></p>
                  {user.rank && <p>Rank: {user.rank}</p>}
                  {user.role && <p>Role: {user.role}</p>}
                </div>

                <div className="user-count-card">
                  <h3>Total Registered Users</h3>
                  <p className="count">{userCount}</p>
                </div>

                <div className="users-list">
                  <h3>Registered Users</h3>
                  {usersList.length > 0 ? (
                      <table>
                        <thead>
                        <tr>
                          <th>Full Name</th>
                          <th>Rank</th>
                          <th>Role</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersList.map((u) => (
                            <tr key={u.uuuuid}>
                              <td>{u.name || '-'}</td>
                              <td>{u.rank || '-'}</td>
                              <td>{u.role || '-'}</td>
                              <td>
                                {new Date(u.date_created).toLocaleString('en-MY', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>

                              <td style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setSelectedDeleteUUID(u.uuid)} className="btn logout">Delete</button>

                                <Link to={'/profile?id=' + u.uuid} className="btn">
                                  Edit
                                </Link>

                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                  ) : usersList.length === 0 ?(
                      <p>No users found</p>
                  ) : loading ? (
                      <p>Loading users...</p>
                  ) : (
                      <p>Error loading users</p>
                  )}
                </div>

                {/*<div className="actions">*/}
                {/*  <Link to="/profile" className="btn">Update Profile</Link>*/}
                {/*  <button onClick={handleLogout} className="btn logout">Logout</button>*/}
                {/*</div>*/}
              </>
          ) : (
              <p>No user data found</p>
          )}
        </div>
      </>
  );
}

const DeleteConfirmModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
      <div
          style={{
            position: 'fixed',      // key to stay on top
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent backdrop
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,          // make sure it’s above other elements
          }}
      >
        <div
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              width: '400px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
        >
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this data? This action cannot be undone.</p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' , marginTop:"30px"}}>
            <button onClick={onCancel}>Cancel</button>

            <button
                onClick={onConfirm}
                className="btn logout">Delete</button>
          </div>
        </div>
      </div>
  );
};


// Profile Component
function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    rank: '',
    role: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('id');

        if (token) {
          const result = await api.getProfile(token);
          if (result.code == 111) {
            setProfile({
              name: result.data.name || '',
              rank: result.data.rank || '',
              role: result.data.role || ''
            });
          }
        }
      } catch (error) {
        console.error('Profile load error:', error);
        setMessage('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('id');
      profile.uuid = token

      const result = await api.updateProfile(profile);

      if (result.code == 111) {
        setMessage('Profile updated successfully!');
        // Update localStorage user data
        const user = JSON.parse(localStorage.getItem('user'));
        user.name = profile.name;
        user.rank = profile.rank;
        user.role = profile.role;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setMessage('Update failed');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
      console.error('Profile update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={profile.name}
          onChange={(e) => setProfile({...profile, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Rank"
          value={profile.rank}
          onChange={(e) => setProfile({...profile, rank: e.target.value})}
        />
        <input
          type="text"
          placeholder="Role"
          value={profile.role}
          onChange={(e) => setProfile({...profile, role: e.target.value})}
        />
        <button type="submit">Update Profile</button>
      </form>
      {message && <p className="message">{message}</p>}
      <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
