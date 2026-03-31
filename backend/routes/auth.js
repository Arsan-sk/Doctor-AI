import express from 'express';
import { 
    validateRegistrationData, 
    validateLoginData,
    sanitizeObject,
    validateEmail,
    validatePassword
} from '../utils/validation.js';
import { 
    hashPassword, 
    comparePassword,
    validatePasswordStrength 
} from '../utils/password.js';
import { 
    generateToken, 
    verifyToken,
    authenticateToken
} from '../utils/token.js';
import { 
    getUserByEmail, 
    createUser, 
    getUserById,
    updateUser 
} from '../utils/db.js';
import { 
    SUCCESS_MESSAGES, 
    ERROR_MESSAGES, 
    HTTP_STATUS 
} from '../config.js';

const router = express.Router();

// ============================================
// REGISTER ROUTE - EMAIL & PASSWORD
// ============================================

router.post('/register', async (req, res) => {
    try {
        const { email, password, confirmPassword, fullName, age, phone, address } = req.body;

        // Validate all required fields
        if (!email || !password || !confirmPassword || !fullName || !phone || !address) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Validation failed',
                message: 'All fields required: email, password, fullName, age, phone, address'
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Invalid email format'
            });
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Passwords do not match'
            });
        }

        // Validate password strength
        const passwordStrength = validatePasswordStrength(password);
        if (!passwordStrength.isValid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Password too weak',
                message: passwordStrength.message
            });
        }

        // Check if email already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(HTTP_STATUS.CONFLICT).json({
                error: ERROR_MESSAGES.USER_ALREADY_EXISTS,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Generate username from email (before @)
        const username = email.split('@')[0].toLowerCase();

        // Create user
        const newUser = await createUser({
            email: email.toLowerCase().trim(),
            username: username.trim(),
            password_hash: hashedPassword,
            full_name: fullName.trim(),
            age: age ? parseInt(age) : null,
            phone: phone.trim(),
            address: address.trim(),
            is_active: true
        });

        // Generate JWT token (valid for 7 days)
        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username
        });

        // Return success response with token
        res.status(HTTP_STATUS.CREATED).json({
            message: 'Registration successful',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                fullName: newUser.full_name,
                age: newUser.age,
                phone: newUser.phone,
                address: newUser.address
            },
            token: token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR,
            message: error.message
        });
    }
});

// ============================================
// LOGIN ROUTE - EMAIL & PASSWORD
// ============================================

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Email and password required'
            });
        }

        // Find user by email
        const user = await getUserByEmail(email);
        
        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: 'Invalid credentials',
                message: 'Email or password incorrect'
            });
        }

        // Compare passwords
        const passwordMatch = await comparePassword(password, user.password_hash);
        
        if (!passwordMatch) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: 'Invalid credentials',
                message: 'Email or password incorrect'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: 'Account disabled'
            });
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            username: user.username
        });

        // Return success response
        res.status(HTTP_STATUS.OK).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.full_name,
                age: user.age,
                phone: user.phone,
                address: user.address
            },
            token: token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// GET CURRENT USER (Protected Route)
// ============================================

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                error: ERROR_MESSAGES.USER_NOT_FOUND
            });
        }

        res.status(HTTP_STATUS.OK).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.full_name,
                age: user.age,
                phone: user.phone,
                address: user.address,
                isActive: user.is_active
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            error: ERROR_MESSAGES.INVALID_TOKEN
        });
    }
});

// ============================================
// CHECK AUTH STATUS (Protected Route)
// ============================================

router.get('/check', authenticateToken, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);

        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                isAuthenticated: false,
                error: 'User not found'
            });
        }

        res.status(HTTP_STATUS.OK).json({
            isAuthenticated: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.full_name
            }
        });

    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            isAuthenticated: false,
            error: 'Not authenticated'
        });
    }
});

// ============================================
// UPDATE PROFILE (Protected Route)
// ============================================

router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { fullName, age, phone, address } = req.body;

        // Update user data
        const updatedUser = await updateUser(req.user.id, {
            full_name: fullName || undefined,
            age: age ? parseInt(age) : undefined,
            phone: phone || undefined,
            address: address || undefined
        });

        res.status(HTTP_STATUS.OK).json({
            message: SUCCESS_MESSAGES.USER_UPDATED,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                username: updatedUser.username,
                fullName: updatedUser.full_name,
                age: updatedUser.age,
                phone: updatedUser.phone,
                address: updatedUser.address
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// LOGOUT ROUTE
// ============================================

router.post('/logout', (req, res) => {
    try {
        // Token is stored on client side, server just confirms logout
        res.status(HTTP_STATUS.OK).json({
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// VERIFY TOKEN
// ============================================

router.post('/verify', (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                valid: false,
                error: 'No token provided'
            });
        }

        const decoded = verifyToken(token);
        res.status(HTTP_STATUS.OK).json({
            valid: true,
            user: decoded
        });

    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            valid: false,
            error: 'Invalid or expired token'
        });
    }
});

export default router;
