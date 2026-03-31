import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// ============================================
// SUPABASE CLIENT INITIALIZATION
// ============================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials in .env file');
}

// Regular client for authenticated requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations (use with caution)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

// ============================================
// CONFIGURATION OBJECT
// ============================================

export const config = {
    // Server
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    
    // Database
    supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        serviceRoleKey: supabaseServiceRoleKey
    },
    
    // JWT
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    jwtExpiry: process.env.JWT_EXPIRY || '7d',
    
    // Session
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
    
    // CORS
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    
    // Rate limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    
    // App
    appName: process.env.APP_NAME || 'AI Doctor',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    appDebug: process.env.APP_DEBUG === 'true',
    
    // Features
    features: {
        emailVerification: false,
        twoFactorAuth: false,
        socialLogin: false,
        paymentGateway: false // COD only for now
    },
    
    // Medicine pricing (in INR)
    pricing: {
        defaultDeliveryCharge: 0, // Free delivery
        minOrderAmount: 100,
        maxOrderAmount: 50000
    }
};

// ============================================
// DATABASE TABLES
// ============================================

export const DB_TABLES = {
    USERS: 'users',
    ANALYSES: 'analyses',
    SYMPTOM_RECORDS: 'symptom_records',
    CART_ITEMS: 'cart_items',
    ORDERS: 'orders',
    ORDER_ITEMS: 'order_items',
    ORDER_ANALYSES: 'order_analyses',
    AUDIT_LOGS: 'audit_logs'
};

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid username or password',
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'Username already exists',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_TOKEN: 'Invalid or expired token',
    MISSING_FIELDS: 'Missing required fields',
    INVALID_EMAIL: 'Invalid email format',
    WEAK_PASSWORD: 'Password must be at least 8 characters',
    INTERNAL_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database error occurred',
    INVALID_INPUT: 'Invalid input provided',
    NOT_FOUND: 'Resource not found',
    FORBIDDEN: 'Access forbidden'
};

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
    SIGNUP_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    CART_UPDATED: 'Cart updated successfully',
    ORDER_PLACED: 'Order placed successfully',
    ANALYSIS_SAVED: 'Analysis saved successfully',
    USER_UPDATED: 'User profile updated successfully'
};

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION_RULES = {
    USERNAME: {
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9_-]+$/, // Alphanumeric, underscore, hyphen
        message: 'Username must be 3-50 characters, alphanumeric, underscore or hyphen only'
    },
    PASSWORD: {
        minLength: 8,
        maxLength: 128,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, // At least one lowercase, uppercase, digit
        message: 'Password must be 8+ characters with uppercase, lowercase, and number'
    },
    EMAIL: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format'
    },
    PHONE: {
        pattern: /^[0-9]{10}$/,
        message: 'Phone number must be 10 digits'
    },
    AGE: {
        minValue: 1,
        maxValue: 150,
        message: 'Age must be between 1 and 150'
    },
    QUANTITY: {
        minValue: 1,
        maxValue: 100,
        message: 'Quantity must be between 1 and 100'
    }
};

// ============================================
// STATUS CODES
// ============================================

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

export default config;
