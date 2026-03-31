import express from 'express';
import { 
    validateRegistrationData, 
    validateLoginData,
    sanitizeObject 
} from '../utils/validation.js';
import { 
    hashPassword, 
    comparePassword,
    validatePasswordStrength 
} from '../utils/password.js';
import { 
    generateToken, 
    verifyToken 
} from '../utils/token.js';
import { 
    getUserByUsername, 
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
// REGISTER ROUTE
// ============================================

router.post('/register', async (req, res) => {
    try {
        const { username, password, confirmPassword, age, phone, address, fullName, email } = req.body;

        // Validate input
        const validationResult = validateRegistrationData({
            username,
            password,
            confirmPassword,
            age,
            phone,
            address
        });

        if (!validationResult.valid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Validation failed',
                fields: validationResult.errors
            });
        }

        // Check if username already exists
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(HTTP_STATUS.CONFLICT).json({
                error: ERROR_MESSAGES.USER_ALREADY_EXISTS
            });
        }

        // Hash password
        const passwordStrength = validatePasswordStrength(password);
        if (!passwordStrength.isValid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: passwordStrength.message
            });
        }

        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = await createUser({
            username: username.toLowerCase().trim(),
            password_hash: hashedPassword,
            email: email || null,
            full_name: fullName || null,
            age: parseInt(age),
            phone: phone.trim(),
            address: address.trim(),
            is_active: true
        });

        // Generate token
        const token = generateToken({
            id: newUser.id,
            username: newUser.username
        });

        // Return success response
        res.status(HTTP_STATUS.CREATED).json({
            message: SUCCESS_MESSAGES.SIGNUP_SUCCESS,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                fullName: newUser.full_name,
                age: newUser.age,
                phone: newUser.phone
            },
            token,
            expiresIn: '7d'
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
// LOGIN ROUTE
// ============================================

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        const validationResult = validateLoginData({ username, password });

        if (!validationResult.valid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Validation failed',
                fields: validationResult.errors
            });
        }

        // Find user by username
        const user = await getUserByUsername(username.toLowerCase().trim());

        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: ERROR_MESSAGES.INVALID_CREDENTIALS
            });
        }

        // Compare passwords
        const isPasswordValid = await comparePassword(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: ERROR_MESSAGES.INVALID_CREDENTIALS
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                error: 'Account is inactive'
            });
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            username: user.username
        });

        // Return success response
        res.status(HTTP_STATUS.OK).json({
            message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                age: user.age,
                phone: user.phone,
                address: user.address
            },
            token,
            expiresIn: '7d'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR,
            message: error.message
        });
    }
});

// ============================================
// LOGOUT ROUTE
// ============================================

router.post('/logout', (req, res) => {
    // JWT logout is handled on client side by removing token
    // This is just a confirmation endpoint
    res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
    });
});

// ============================================
// GET CURRENT USER
// ============================================

router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: ERROR_MESSAGES.UNAUTHORIZED
            });
        }

        const decoded = verifyToken(token);
        const user = await getUserById(decoded.id);

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                error: ERROR_MESSAGES.USER_NOT_FOUND
            });
        }

        res.status(HTTP_STATUS.OK).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                age: user.age,
                phone: user.phone,
                address: user.address
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
// UPDATE PROFILE
// ============================================

router.put('/profile', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: ERROR_MESSAGES.UNAUTHORIZED
            });
        }

        const decoded = verifyToken(token);
        const { age, phone, address, fullName, email } = req.body;

        // Update user data
        const updatedUser = await updateUser(decoded.id, {
            age: age ? parseInt(age) : undefined,
            phone: phone || undefined,
            address: address || undefined,
            full_name: fullName || undefined,
            email: email || undefined
        });

        res.status(HTTP_STATUS.OK).json({
            message: SUCCESS_MESSAGES.USER_UPDATED,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
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
// VERIFY TOKEN
// ============================================

router.post('/verify', (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                valid: false,
                error: ERROR_MESSAGES.UNAUTHORIZED
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
            error: ERROR_MESSAGES.INVALID_TOKEN
        });
    }
});

export default router;
