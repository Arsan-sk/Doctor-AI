# 🚀 Implementation Guide - AI Doctor Project

This document provides step-by-step guidance for completing the project implementation.

---

## 📌 Project Overview

The project has been restructured to follow production-level standards with:
- ✅ Separated backend and frontend
- ✅ Database schema created
- ✅ Authentication system ready
- ✅ API routes configured
- ✅ Environment setup
- ✅ API client created
- ⏳ Next: Integrate frontend with backend API

---

## 🔄 Project Status

### ✅ Completed

1. **Database Schema** (`database/schema.sql`)
   - 8 PostgreSQL tables with relationships
   - Indexes for performance
   - Views for common queries
   - Row Level Security (RLS) policies

2. **Backend Infrastructure**
   - Express.js server setup
   - Authentication routes (Register, Login, Verify)
   - Analysis endpoints
   - Cart management endpoints
   - Order processing endpoints
   - Utility modules for:
     - Password hashing & validation
     - JWT token generation
     - Database operations
     - Input validation

3. **Frontend Utilities**
   - API client for backend communication
   - Medical reference data
   - Helper functions
   - medial data repository

4. **Configuration Files**
   - `.env.example` - Template with all required variables
   - `.gitignore` - Ignores sensitive files
   - `package.json` - Dependencies and scripts
   - `README.md` - Comprehensive documentation

### ⏳ To Be Completed

1. **Frontend Integration**
   - Migrate existing HTML to modular structure
   - Create authentication UI pages
   - Integrate API calls

2. **Environment Setup**
   - Install dependencies: `npm install`
   - Configure `.env` with Supabase credentials
   - Create Supabase database tables

3. **Testing**
   - Verify database connections
   - Test API endpoints
   - Test authentication flow

---

## 🛠️ Step-by-Step Implementation

### Step 1: Install Dependencies

```bash
cd artificial-doctor
npm install
```

Expected output: All packages installed successfully

Packages installed:
- express, dotenv, cors, compression, helmet
- bcryptjs, jsonwebtoken
- @supabase/supabase-js
- express-rate-limit, validator, uuid

### Step 2: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit with your Supabase credentials
# Use your editor to update:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY (optional)
# - JWT_SECRET (generate a strong random string)
```

### Step 3: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Sign up / Login
3. Create new project:
   - Name: "artificial-doctor" (or your choice)
   - Database Password: Generate strong password
   - Region: Choose nearest region
4. Wait for project creation (~2 minutes)
5. Go to Project Settings → API
6. Copy:
   - Project URL → `SUPABASE_URL`
   - `anon` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Initialize Database

```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. New Query
# 3. Copy entire contents of database/schema.sql
# 4. Paste into editor
# 5. Click "Execute"
# 6. Wait for completion (should see all tables created)

# Verify tables were created:
SELECT tablename FROM pg_tables WHERE schemaname='public';
```

Expected tables:
- users
- analyses
- cart_items
- orders
- order_items
- symptom_records
- order_analyses
- audit_logs

### Step 5: Start Backend Server

```bash
# Terminal 1: Start development server
npm run dev

# Expected output:
# ╔════════════════════════════════════════╗
# ║    🩺 AI Doctor - Backend Server      ║
# ╚════════════════════════════════════════╝
#
# Server running on: http://localhost:3000
# Environment: development
# Database: Supabase (https://xxxx.supabase.co)
```

### Step 6: Verify API Health

```bash
# Terminal 2: Test API
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-03-30T10:30:00.000Z","environment":"development"}
```

---

## 🔗 API Endpoints (Quick Reference)

### Authentication
```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Sign in
GET    /api/auth/me           - Get current user
PUT    /api/auth/profile      - Update profile
POST   /api/auth/verify       - Verify token
POST   /api/auth/logout       - Logout
```

### Analysis
```
GET    /api/analysis          - Get user's analyses
POST   /api/analysis          - Save new analysis
GET    /api/analysis/:id      - Get analysis details
```

### Cart
```
GET    /api/cart              - Get cart items
POST   /api/cart              - Add to cart
PUT    /api/cart/:id          - Update cart item
DELETE /api/cart/:id          - Remove from cart
DELETE /api/cart              - Clear cart
GET    /api/cart/total        - Get cart total
```

### Orders
```
GET    /api/orders            - Get user orders
GET    /api/orders/:id        - Get order details
POST   /api/orders            - Create order
PUT    /api/orders/:id/cancel - Cancel order
```

---

## 📱 Frontend Integration Steps

### Step 1: Copy Existing Files to Frontend

```bash
# Move frontend files to proper folder
cp index.html frontend/
cp style.css frontend/
# Old app.js will be refactored into modular files
```

### Step 2: Create Frontend Main Entry Point

Create `frontend/js/main.js`:
```javascript
// Import API client and utilities
import { authAPI, cartAPI, orderAPI, analysisAPI } from './api.js';
import { medicalData } from './utils/medical-data.js';
import { 
    capitalizeWords, 
    formatCurrency, 
    setLocalStorage, 
    getLocalStorage 
} from './utils/helpers.js';

// Initialize the app on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const token = getLocalStorage('authToken');
    
    if (token) {
        try {
            // Verify token
            const response = await authAPI.verifyToken();
            // User is logged in, load dashboard
            initializeApp();
        } catch (error) {
            // Token invalid, show login
            localStorage.clear();
            showAuthPages();
        }
    } else {
        // Show landing page
        showLandingPage();
    }
});

// ... rest of the application logic
```

### Step 3: Update HTML Links

In `frontend/index.html`, update script tags:
```html
<!-- At the end before closing body -->
<script type="module" src="js/main.js"></script>
```

### Step 4: Integrate Authentication

Create login/register handlers:
```javascript
// Handle registration
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        username: document.getElementById('userName').value,
        password: document.getElementById('userPassword').value,
        confirmPassword: document.getElementById('userPasswordConfirm').value,
        age: document.getElementById('userAge').value,
        phone: document.getElementById('userMobile').value,
        address: document.getElementById('userAddress').value
    };
    
    try {
        const response = await authAPI.register(userData);
        
        // Save token
        setLocalStorage('authToken', response.token);
        setLocalStorage('user', response.user);
        
        // Redirect to symptoms page
        window.location.href = '/index.html#symptoms';
    } catch (error) {
        showError('Registration failed: ' + error.message);
    }
});
```

### Step 5: Integrate Cart & Orders

Connect cart functionality to backend:
```javascript
// Add to cart
export async function addToCart(medicine) {
    try {
        const response = await cartAPI.addItem({
            medicineName: medicine.name,
            dosage: medicine.dosage,
            quantity: 1,
            pricePerUnit: extractPrice(medicine.price_range)
        });
        
        showToast('Added to cart!', 'success');
        updateCartDisplay();
    } catch (error) {
        showError('Failed to add to cart: ' + error.message);
    }
}

// Checkout
export async function checkout() {
    try {
        const result = await orderAPI.create({
            deliveryAddress: document.getElementById('address').value,
            phone: document.getElementById('phone').value
        });
        
        // Show order confirmation
        showOrderConfirmation(result.order);
    } catch (error) {
        showError('Order failed: ' + error.message);
    }
}
```

---

## 🧪 Testing Endpoints with cURL

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "age": 25,
    "phone": "9876543210",
    "address": "123 Main St, City, State 12345",
    "fullName": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123!"
  }'
```

### Test Add to Cart (with token)
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "medicineName": "Paracetamol",
    "dosage": "500mg",
    "quantity": 2,
    "pricePerUnit": 25
  }'
```

---

## 🐛 Troubleshooting

### Issue: "SUPABASE_URL is required"
**Solution:** Check `.env` file has correct values from Supabase

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:** Run `npm install` again

### Issue: "Port 3000 already in use"
**Solution:** 
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### Issue: "JWT_SECRET must be at least 32 characters"
**Solution:** In `.env`, set:
```
JWT_SECRET=your-very-long-secure-secret-key-needs-to-be-at-least-32-characters-long
```

### Issue: Database tables not created
**Solution:**
1. Check Supabase SQL Editor for errors
2. Copy entire schema.sql again
3. Execute in smaller chunks if needed
4. Check table names in SQL Editor

---

## 📋 Deployment Checklist

- [ ] All environment variables set in `.env`
- [ ] Database schema created in Supabase
- [ ] Backend server tested locally
- [ ] Frontend HTML updated
- [ ] API integration completed
- [ ] User registration tested
- [ ] Login flow tested
- [ ] Cart functionality tested
- [ ] Order placement tested
- [ ] Error handling tested
- [ ] .gitignore properly configured
- [ ] No sensitive data in commits
- [ ] README updated with your info
- [ ] Deploy to Vercel/Heroku

---

## 📚 Additional Resources

### Supabase Documentation
- [Supabase Getting Started](https://supabase.com/docs)
- [SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Authentication](https://supabase.com/docs/guides/auth)

### Express.js
- [Express Documentation](https://expressjs.com/)
- [Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)

### JWT Tokens
- [JWT.io](https://jwt.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure Supabase
3. ✅ Create database tables
4. ✅ Start backend server
5. ✅ Test API endpoints
6. ⏳ Integrate frontend
7. ⏳ Test complete flow
8. ⏳ Optimize for deployment
9. ⏳ Deploy to production

---

## ✉️ Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review error messages carefully
3. Check environment variables
4. Verify database connection
5. Check API response format

---

**Ready to build something amazing? Let's get started! 🚀**
