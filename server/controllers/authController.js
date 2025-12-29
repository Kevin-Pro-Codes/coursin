const db = require('../database/db');
const { 
    hashPassword, 
    comparePassword, 
    generateToken, 
    isValidEmail,
    sanitizeInput 
} = require('../utils/helpers');

class AuthController {
    // User registration
    static async register(req, res) {
        let body = '';
        
        // Collect request body
        req.on('data', chunk => body += chunk);
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                
                // Validate input
                const { name, email, password } = data;
                
                if (!name || !email || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'All fields are required'
                    }));
                }

                // Sanitize inputs
                const sanitizedName = sanitizeInput(name);
                const sanitizedEmail = sanitizeInput(email).toLowerCase();

                // Validate email
                if (!isValidEmail(sanitizedEmail)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'Please enter a valid email address'
                    }));
                }

                // Validate password length
                if (password.length < 6) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'Password must be at least 6 characters'
                    }));
                }

                // Check if user already exists
                const existingUsers = await db.query(
                    'SELECT id FROM users WHERE email = ?',
                    [sanitizedEmail]
                );

                if (existingUsers && existingUsers.length > 0) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'User already exists with this email'
                    }));
                }

                // Hash password
                const hashedPassword = await hashPassword(password);

                // Insert new user
                const result = await db.execute(
                    `INSERT INTO users (name, email, password) 
                     VALUES (?, ?, ?)`,
                    [sanitizedName, sanitizedEmail, hashedPassword]
                );

                // Generate JWT token
                const token = generateToken(result.insertId);

                // Get created user
                const users = await db.query(
                    `SELECT id, name, email, role, created_at 
                     FROM users WHERE id = ?`,
                    [result.insertId]
                );

                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    message: 'Registration successful!',
                    token,
                    user: users[0]
                }));

            } catch (error) {
                console.error('Registration processing error:', error);
                
                // Check if headers already sent
                if (res.headersSent) {
                    console.warn('Headers already sent, cannot send error response');
                    return;
                }
                
                if (error.code === 'ER_DUP_ENTRY') {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'Email already exists'
                    }));
                }

                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    message: 'Registration failed. Please try again.'
                }));
            }
        });
        
        // Handle request errors
        req.on('error', (error) => {
            console.error('Request error:', error);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Request error'
                }));
            }
        });
    }

    // User login
    static async login(req, res) {
        let body = '';
        
        req.on('data', chunk => body += chunk);
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { email, password } = data;

                if (!email || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'Email and password are required'
                    }));
                }

                const sanitizedEmail = sanitizeInput(email).toLowerCase();

                // Get user with password
                const users = await db.query(
                    'SELECT * FROM users WHERE email = ?',
                    [sanitizedEmail]
                );

                if (!users || users.length === 0) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid email or password'
                    }));
                }

                const user = users[0];

                // Verify password
                const isPasswordValid = await comparePassword(password, user.password);
                if (!isPasswordValid) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid email or password'
                    }));
                }

                // Update last login
                await db.execute(
                    'UPDATE users SET last_login = NOW() WHERE id = ?',
                    [user.id]
                );

                // Generate token
                const token = generateToken(user.id);

                // Remove password from user object
                delete user.password;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    message: 'Login successful',
                    token,
                    user
                }));

            } catch (error) {
                console.error('Login processing error:', error);
                
                if (res.headersSent) {
                    console.warn('Headers already sent, cannot send error response');
                    return;
                }
                
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    message: 'Login failed. Please try again.'
                }));
            }
        });
        
        req.on('error', (error) => {
            console.error('Request error:', error);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Request error'
                }));
            }
        });
    }

    // Get user profile
    static async getProfile(req, res) {
        try {
            // Check if user exists in request (added by auth middleware)
            if (!req.user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    message: 'User not authenticated'
                }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                user: req.user
            }));
        } catch (error) {
            console.error('Get profile error:', error);
            
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Server error'
                }));
            }
        }
    }

    // Update user profile (simplified for now)
    static async updateProfile(req, res) {
        let body = '';
        
        req.on('data', chunk => body += chunk);
        
        req.on('end', async () => {
            try {
                if (!req.user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'User not authenticated'
                    }));
                }

                const data = JSON.parse(body);
                const { name, email } = data;

                // Validate inputs
                if (!name && !email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        success: false,
                        message: 'At least one field (name or email) is required'
                    }));
                }

                // Update user
                if (name) {
                    await db.execute(
                        'UPDATE users SET name = ? WHERE id = ?',
                        [sanitizeInput(name), req.user.id]
                    );
                }

                if (email && email !== req.user.email) {
                    const sanitizedEmail = sanitizeInput(email).toLowerCase();
                    
                    if (!isValidEmail(sanitizedEmail)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({
                            success: false,
                            message: 'Please enter a valid email address'
                        }));
                    }

                    // Check if email already exists
                    const existingUsers = await db.query(
                        'SELECT id FROM users WHERE email = ? AND id != ?',
                        [sanitizedEmail, req.user.id]
                    );

                    if (existingUsers && existingUsers.length > 0) {
                        res.writeHead(409, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({
                            success: false,
                            message: 'Email already in use'
                        }));
                    }

                    await db.execute(
                        'UPDATE users SET email = ? WHERE id = ?',
                        [sanitizedEmail, req.user.id]
                    );
                }

                // Get updated user
                const updatedUsers = await db.query(
                    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
                    [req.user.id]
                );

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    message: 'Profile updated successfully',
                    user: updatedUsers[0]
                }));

            } catch (error) {
                console.error('Update profile error:', error);
                
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Failed to update profile'
                    }));
                }
            }
        });
        
        req.on('error', (error) => {
            console.error('Request error:', error);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Request error'
                }));
            }
        });
    }
}

module.exports = AuthController;