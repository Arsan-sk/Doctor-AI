import bcrypt from 'bcryptjs';

// ============================================
// PASSWORD HASHING
// ============================================

/**
 * Hash a password using bcryptjs
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} - True if passwords match
 */
export async function comparePassword(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export function validatePasswordStrength(password) {
    if (password.length < 8) {
        return { 
            isValid: false, 
            message: 'Password must be at least 8 characters long' 
        };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { 
            isValid: false, 
            message: 'Password must contain at least one uppercase letter' 
        };
    }
    
    if (!/[a-z]/.test(password)) {
        return { 
            isValid: false, 
            message: 'Password must contain at least one lowercase letter' 
        };
    }
    
    if (!/[0-9]/.test(password)) {
        return { 
            isValid: false, 
            message: 'Password must contain at least one digit' 
        };
    }
    
    return { isValid: true, message: 'Password is strong' };
}

export default {
    hashPassword,
    comparePassword,
    validatePasswordStrength
};
