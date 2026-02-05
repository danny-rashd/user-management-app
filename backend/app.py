from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'

DATABASE = 'users.db'

# Handle CORS for all requests
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

# Handle OPTIONS requests separately
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        return response

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        # Check if rank and role columns exist, if not add them
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                full_name TEXT,
                rank TEXT,
                role TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Try to add rank and role columns if they don't exist (for existing databases)
        try:
            cursor.execute('ALTER TABLE users ADD COLUMN rank TEXT')
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        try:
            cursor.execute('ALTER TABLE users ADD COLUMN role TEXT')
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        conn.commit()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name', '')
    rank = data.get('rank', '')
    role = data.get('role', '')
    
    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    hashed_password = generate_password_hash(password)
    
    try:
        with get_db() as conn:
            conn.execute(
                'INSERT INTO users (username, email, password, full_name, rank, role) VALUES (?, ?, ?, ?, ?, ?)',
                (username, email, hashed_password, full_name, rank, role)
            )
            conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username or email already exists'}), 409

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Missing credentials'}), 400
    
    with get_db() as conn:
        user = conn.execute(
            'SELECT * FROM users WHERE username = ?',
            (username,)
        ).fetchone()
    
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'full_name': user['full_name'],
            'rank': user['rank'],
            'role': user['role']
        }
    }), 200

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    with get_db() as conn:
        user = conn.execute(
            'SELECT id, username, email, full_name, rank, role, created_at FROM users WHERE id = ?',
            (current_user_id,)
        ).fetchone()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'full_name': user['full_name'],
        'rank': user['rank'],
        'role': user['role'],
        'created_at': user['created_at']
    }), 200

@app.route('/api/profile', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    data = request.get_json()
    
    email = data.get('email')
    full_name = data.get('full_name')
    rank = data.get('rank')
    role = data.get('role')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    try:
        with get_db() as conn:
            conn.execute(
                'UPDATE users SET email = ?, full_name = ?, rank = ?, role = ? WHERE id = ?',
                (email, full_name, rank, role, current_user_id)
            )
            conn.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Email already exists'}), 409

@app.route('/api/users/count', methods=['GET'])
@token_required
def get_user_count(current_user_id):
    with get_db() as conn:
        count = conn.execute('SELECT COUNT(*) as count FROM users').fetchone()
    
    return jsonify({'count': count['count']}), 200

@app.route('/api/users', methods=['GET'])
@token_required
def get_users_list(current_user_id):
    with get_db() as conn:
        users = conn.execute(
            'SELECT id, username, email, full_name, rank, role, created_at FROM users ORDER BY created_at DESC'
        ).fetchall()
    
    users_list = []
    for user in users:
        users_list.append({
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'full_name': user['full_name'],
            'rank': user['rank'],
            'role': user['role'],
            'created_at': user['created_at']
        })
    
    return jsonify({'users': users_list}), 200

if __name__ == '__main__':
    init_db()
    print("=" * 50)
    print("Flask server starting on http://localhost:5001")
    print("CORS enabled for all origins")
    print("=" * 50)
    app.run(debug=True, port=5001, host='0.0.0.0')
