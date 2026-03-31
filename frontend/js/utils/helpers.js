// Utility Helper Functions

/**
 * Capitalize words
 */
export function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

/**
 * Get age options
 */
export function generateAgeOptions() {
    const ages = [];
    for (let i = 1; i <= 100; i++) {
        ages.push(i);
    }
    return ages;
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

/**
 * Get time ago string
 */
export function getTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(date).toLocaleDateString();
}

/**
 * Generate unique ID
 */
export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 */
export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Get query parameter
 */
export function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

/**
 * Show toast notification
 */
export function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#ff5459' : type === 'success' ? '#32b8c6' : '#6c6c73'};
        color: white;
        border-radius: 6px;
        z-index: 10000;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Load JSON from localStorage
 */
export function getLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        return null;
    }
}

/**
 * Save JSON to localStorage
 */
export function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Remove from localStorage
 */
export function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage() {
    localStorage.clear();
}

export default {
    capitalizeWords,
    formatCurrency,
    generateAgeOptions,
    isValidEmail,
    isValidPhone,
    getTimeAgo,
    generateId,
    debounce,
    getQueryParam,
    showToast,
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
    clearLocalStorage
};
