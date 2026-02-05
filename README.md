# User Management Web App

A full-stack web application with user registration, authentication, profile management, and user statistics.

## Features

- **User Registration**: Create new user accounts
- **User Login**: Secure authentication with JWT tokens
- **Profile Management**: Update email and full name
- **User Statistics**: View total registered users count (authenticated users only)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Python 3.x
- Flask (Web framework)
- SQLite (Database)
- JWT (Authentication)
- Flask-CORS (Cross-Origin Resource Sharing)

### Frontend
- React 18
- React Router (Navigation)
- Modern CSS with gradient backgrounds

## Project Structure

```
user-management-app/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── users.db           # SQLite database (created on first run)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Base styles
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Usage

1. **Register a New Account**
   - Open your browser to `http://localhost:3000`
   - You'll be redirected to the login page
   - Click "Register here" link
   - Fill in username, email, password, and optionally full name
   - Click "Register"

2. **Login**
   - Enter your username and password
   - Click "Login"
   - You'll be redirected to the dashboard

3. **View Dashboard**
   - See your user information
   - View the total number of registered users
   - Access profile update or logout

4. **Update Profile**
   - Click "Update Profile" button
   - Modify your email or full name
   - Click "Update Profile" to save changes

5. **Logout**
   - Click "Logout" button from the dashboard

## API Endpoints

### Public Endpoints
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and receive JWT token

### Protected Endpoints (Require JWT Token)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile
- `GET /api/users/count` - Get total registered users count

## Security Notes

⚠️ **Important**: This is a demo application. For production use:

1. Change the `SECRET_KEY` in `app.py` to a strong, random value
2. Use environment variables for sensitive configuration
3. Implement HTTPS
4. Add password strength requirements
5. Implement rate limiting
6. Add input validation and sanitization
7. Use a production-grade database (PostgreSQL, MySQL)
8. Add email verification
9. Implement password reset functionality
10. Add CSRF protection

## Database Schema

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### CORS Issues
- Make sure Flask-CORS is installed
- Check that the backend is running on port 5000
- Verify the frontend is making requests to the correct URL

### Database Issues
- Delete `users.db` file and restart the backend to recreate the database
- Check file permissions in the backend directory

### Port Already in Use
- Backend: Change the port in `app.py`: `app.run(debug=True, port=5001)`
- Frontend: Set PORT environment variable: `PORT=3001 npm start`

## License

MIT License - Feel free to use this project for learning purposes.
