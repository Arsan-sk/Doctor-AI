// ============================================
// AUTHENTICATION STATE MANAGEMENT
// ============================================

class AuthManager {
    constructor() {
        this.token = this.getStoredToken();
        this.user = this.getStoredUser();
        this.isInitialized = false;
    }

    /**
     * Get stored token from localStorage
     */
    getStoredToken() {
        return localStorage.getItem('authToken') || null;
    }

    /**
     * Get stored user from localStorage
     */
    getStoredUser() {
        const userJson = localStorage.getItem('userData');
        return userJson ? JSON.parse(userJson) : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    /**
     * Register new user
     */
    async register(formData) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Registration failed');
            }

            // Store token and user data
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));

            return {
                success: true,
                user: data.user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Login failed');
            }

            // Store token and user data
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));

            return {
                success: true,
                user: data.user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Logout user
     */
    logout() {
        this.token = null;
        this.user = null;

        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');

        return {
            success: true
        };
    }

    /**
     * Check authentication with server
     */
    async checkAuthentication() {
        if (!this.token) {
            return {
                isAuthenticated: false
            };
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/check', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok || !data.isAuthenticated) {
                this.logout();
                return {
                    isAuthenticated: false
                };
            }

            return {
                isAuthenticated: true,
                user: this.user
            };
        } catch (error) {
            console.error('Auth check error:', error);
            return {
                isAuthenticated: false
            };
        }
    }

    /**
     * Get Authorization header
     */
    getAuthHeader() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Get current token
     */
    getToken() {
        return this.token;
    }
}

// Export singleton instance
export const authManager = new AuthManager();
