// API Client for Backend Communication

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Make API request
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            ...options.headers
        },
        ...options
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export const authAPI = {
    /**
     * User registration
     */
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    /**
     * User login
     */
    login: async (credentials) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    /**
     * Get current user
     */
    getCurrentUser: async () => {
        return apiRequest('/auth/me', { method: 'GET' });
    },

    /**
     * Update user profile
     */
    updateProfile: async (userData) => {
        return apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    /**
     * Verify token
     */
    verifyToken: async () => {
        return apiRequest('/auth/verify', { method: 'POST' });
    },

    /**
     * Logout
     */
    logout: async () => {
        return apiRequest('/auth/logout', { method: 'POST' });
    }
};

// ============================================
// ANALYSIS ENDPOINTS
// ============================================

export const analysisAPI = {
    /**
     * Save analysis
     */
    save: async (analysisData) => {
        return apiRequest('/analysis', {
            method: 'POST',
            body: JSON.stringify(analysisData)
        });
    },

    /**
     * Get user's analyses
     */
    getAll: async (limit = 10) => {
        return apiRequest(`/analysis?limit=${limit}`, { method: 'GET' });
    },

    /**
     * Get analysis by ID
     */
    getById: async (id) => {
        return apiRequest(`/analysis/${id}`, { method: 'GET' });
    }
};

// ============================================
// CART ENDPOINTS
// ============================================

export const cartAPI = {
    /**
     * Get cart items
     */
    getItems: async () => {
        return apiRequest('/cart', { method: 'GET' });
    },

    /**
     * Add item to cart
     */
    addItem: async (item) => {
        return apiRequest('/cart', {
            method: 'POST',
            body: JSON.stringify(item)
        });
    },

    /**
     * Update cart item
     */
    updateItem: async (id, data) => {
        return apiRequest(`/cart/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    /**
     * Remove from cart
     */
    removeItem: async (id) => {
        return apiRequest(`/cart/${id}`, { method: 'DELETE' });
    },

    /**
     * Clear cart
     */
    clearAll: async () => {
        return apiRequest('/cart', { method: 'DELETE' });
    },

    /**
     * Get cart total
     */
    getTotal: async () => {
        return apiRequest('/cart/total', { method: 'GET' });
    }
};

// ============================================
// ORDER ENDPOINTS
// ============================================

export const orderAPI = {
    /**
     * Get user orders
     */
    getAll: async () => {
        return apiRequest('/orders', { method: 'GET' });
    },

    /**
     * Get order by ID
     */
    getById: async (id) => {
        return apiRequest(`/orders/${id}`, { method: 'GET' });
    },

    /**
     * Create order (checkout)
     */
    create: async (orderData) => {
        return apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    /**
     * Cancel order
     */
    cancel: async (id) => {
        return apiRequest(`/orders/${id}/cancel`, {
            method: 'PUT'
        });
    },

    /**
     * Update order status (admin)
     */
    updateStatus: async (id, status) => {
        return apiRequest(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
};

// ============================================
// HEALTH CHECK
// ============================================

export const serverAPI = {
    /**
     * Check server health
     */
    health: async () => {
        return apiRequest('/health', { method: 'GET' });
    }
};

// ============================================
// MAIN API EXPORT
// ============================================

export default {
    authAPI,
    analysisAPI,
    cartAPI,
    orderAPI,
    serverAPI,
    apiRequest
};
