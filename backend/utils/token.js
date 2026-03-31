import jwt from 'jsonwebtoken';
import { config, ERROR_MESSAGES, HTTP_STATUS } from '../config.js';

// ============================================
// TOKEN GENERATION
// ============================================

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {string} - JWT token
 */
export function generateToken(payload) {
    try {
        return jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.jwtExpiry
        });
    } catch (error) {
        throw new Error('Error generating token');
    }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        throw new Error('Invalid token');
    }
}

/**
 * Decode token without verification
 * @param {string} token - JWT token
 * @returns {Object} - Decoded payload
 */
export function decodeToken(token) {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
}

// ============================================
// MIDDLEWARE
// ============================================

/**
 * Middleware to check if user is authenticated
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            error: ERROR_MESSAGES.UNAUTHORIZED,
            message: 'No token provided'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            error: ERROR_MESSAGES.INVALID_TOKEN,
            message: error.message
        });
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(req) {
    return req.user && req.userId;
}

export default {
    generateToken,
    verifyToken,
    decodeToken,
    authenticateToken,
    isAuthenticated
};
