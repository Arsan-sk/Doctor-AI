import { VALIDATION_RULES, ERROR_MESSAGES } from '../config.js';

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validate username
 */
export function validateUsername(username) {
    const rule = VALIDATION_RULES.USERNAME;
    
    if (!username || username.length < rule.minLength || username.length > rule.maxLength) {
        return { valid: false, message: rule.message };
    }
    
    if (!rule.pattern.test(username)) {
        return { valid: false, message: rule.message };
    }
    
    return { valid: true, message: 'Username is valid' };
}

/**
 * Validate password
 */
export function validatePassword(password) {
    const rule = VALIDATION_RULES.PASSWORD;
    
    if (!password || password.length < rule.minLength || password.length > rule.maxLength) {
        return { valid: false, message: rule.message };
    }
    
    if (!rule.pattern.test(password)) {
        return { valid: false, message: rule.message };
    }
    
    return { valid: true, message: 'Password is valid' };
}

/**
 * Validate email (optional)
 */
export function validateEmail(email) {
    if (!email) return { valid: true, message: 'Email is optional' };
    
    const rule = VALIDATION_RULES.EMAIL;
    if (!rule.pattern.test(email)) {
        return { valid: false, message: rule.message };
    }
    
    return { valid: true, message: 'Email is valid' };
}

/**
 * Validate phone number
 */
export function validatePhone(phone) {
    const rule = VALIDATION_RULES.PHONE;
    
    if (!phone || !rule.pattern.test(phone)) {
        return { valid: false, message: rule.message };
    }
    
    return { valid: true, message: 'Phone is valid' };
}

/**
 * Validate age
 */
export function validateAge(age) {
    const rule = VALIDATION_RULES.AGE;
    
    const numAge = parseInt(age);
    if (isNaN(numAge) || numAge < rule.minValue || numAge > rule.maxValue) {
        return { valid: false, message: rule.message };
    }
    
    return { valid: true, message: 'Age is valid' };
}

/**
 * Validate address
 */
export function validateAddress(address) {
    if (!address || address.trim().length < 10) {
        return { valid: false, message: 'Address must be at least 10 characters' };
    }
    
    if (address.length > 500) {
        return { valid: false, message: 'Address must not exceed 500 characters' };
    }
    
    return { valid: true, message: 'Address is valid' };
}

/**
 * Validate quantity
 */
export function validateQuantity(quantity) {
    const rule = VALIDATION_RULES.QUANTITY;
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < rule.minValue || qty > rule.maxValue) {
        return { valid: false, message: rule.message };
    }
    
    return { valid: true, message: 'Quantity is valid' };
}

/**
 * Validate registration data
 */
export function validateRegistrationData(data) {
    const errors = {};
    
    // Validate username
    if (!data.username) {
        errors.username = 'Username is required';
    } else {
        const usernameCheck = validateUsername(data.username);
        if (!usernameCheck.valid) errors.username = usernameCheck.message;
    }
    
    // Validate password
    if (!data.password) {
        errors.password = 'Password is required';
    } else {
        const passwordCheck = validatePassword(data.password);
        if (!passwordCheck.valid) errors.password = passwordCheck.message;
    }
    
    // Validate confirm password
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate age
    if (!data.age) {
        errors.age = 'Age is required';
    } else {
        const ageCheck = validateAge(data.age);
        if (!ageCheck.valid) errors.age = ageCheck.message;
    }
    
    // Validate phone
    if (!data.phone) {
        errors.phone = 'Phone number is required';
    } else {
        const phoneCheck = validatePhone(data.phone);
        if (!phoneCheck.valid) errors.phone = phoneCheck.message;
    }
    
    // Validate address
    if (!data.address) {
        errors.address = 'Address is required';
    } else {
        const addressCheck = validateAddress(data.address);
        if (!addressCheck.valid) errors.address = addressCheck.message;
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Validate login data
 */
export function validateLoginData(data) {
    const errors = {};
    
    if (!data.username) {
        errors.username = 'Username is required';
    }
    
    if (!data.password) {
        errors.password = 'Password is required';
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Validate symptoms array
 */
export function validateSymptoms(symptoms) {
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
        return { valid: false, message: 'At least one symptom must be selected' };
    }
    
    if (symptoms.length > 30) {
        return { valid: false, message: 'Maximum 30 symptoms can be selected' };
    }
    
    return { valid: true, message: 'Symptoms are valid' };
}

/**
 * Sanitize input string
 */
export function sanitizeString(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .slice(0, 1000); // Limit length
}

/**
 * Sanitize object
 */
export function sanitizeObject(obj) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
}

export default {
    validateUsername,
    validatePassword,
    validateEmail,
    validatePhone,
    validateAge,
    validateAddress,
    validateQuantity,
    validateRegistrationData,
    validateLoginData,
    validateSymptoms,
    sanitizeString,
    sanitizeObject
};
