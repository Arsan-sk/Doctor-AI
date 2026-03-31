// ============================================
// FRONTEND ROUTER & PAGE NAVIGATION
// ============================================

import { authManager } from './auth.js';

class Router {
    constructor() {
        this.currentPage = null;
        this.pages = {
            landing: 'landingPage',
            symptoms: 'symptomPage',
            loading: 'loadingPage',
            results: 'resultsPage',
            cart: 'cartPage',
            checkout: 'checkoutPage',
            confirmation: 'confirmationPage'
        };
    }

    /**
     * Navigate to a page
     */
    async navigate(pageName) {
        // Check if page requires authentication
        const protectedPages = ['symptoms', 'results', 'cart', 'checkout', 'confirmation'];
        
        if (protectedPages.includes(pageName)) {
            if (!authManager.isAuthenticated()) {
                console.warn('Access denied: Not authenticated. Redirecting to landing page.');
                this.showPage('landing');
                return false;
            }
        }

        // Hide all pages
        this.hideAllPages();

        // Show requested page
        this.showPage(pageName);
        this.currentPage = pageName;

        return true;
    }

    /**
     * Show specific page
     */
    showPage(pageName) {
        const pageId = this.pages[pageName];
        if (!pageId) {
            console.error(`Page not found: ${pageName}`);
            return false;
        }

        const pageElement = document.getElementById(pageId);
        if (pageElement) {
            pageElement.classList.add('active');
            
            // Trigger page-specific logic
            this.onPageShow(pageName);
            
            return true;
        }

        return false;
    }

    /**
     * Hide all pages
     */
    hideAllPages() {
        Object.values(this.pages).forEach(pageId => {
            const element = document.getElementById(pageId);
            if (element) {
                element.classList.remove('active');
            }
        });
    }

    /**
     * Page-specific initialization on show
     */
    onPageShow(pageName) {
        switch (pageName) {
            case 'landing':
                this.initializeLandingPage();
                break;
            case 'symptoms':
                this.initializeSymptomsPage();
                break;
            case 'cart':
                this.initializeCartPage();
                break;
            default:
                break;
        }
    }

    /**
     * Initialize landing page
     */
    initializeLandingPage() {
        const registerBtn = document.querySelector('[data-action="register"]');
        const loginBtn = document.querySelector('[data-action="login"]');

        if (registerBtn) {
            registerBtn.onclick = () => this.openRegisterModal();
        }

        if (loginBtn) {
            loginBtn.onclick = () => this.openLoginModal();
        }
    }

    /**
     * Initialize symptoms page
     */
    initializeSymptomsPage() {
        // Symptoms page should already have listeners attached in app.js
        console.log('Symptoms page initialized');
    }

    /**
     * Initialize cart page
     */
    initializeCartPage() {
        console.log('Cart page initialized');
        displayCart();
    }

    /**
     * Open register modal
     */
    openRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Open login modal
     */
    openLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Close modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Get current page
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Redirect to landing page
     */
    redirectToLanding() {
        this.navigate('landing');
    }

    /**
     * Redirect to symptoms page
     */
    redirectToSymptoms() {
        this.navigate('symptoms');
    }
}

// Export singleton instance
export const router = new Router();
