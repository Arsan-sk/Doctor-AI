# 🩺 AI Doctor - Medical Symptom Analyzer & Medicine Platform

A comprehensive AI-powered medical symptom analyzer with database integration, user authentication, shopping cart, and order management system.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## 🎯 Overview

AI Doctor is a medical assistance platform that helps users:
- Analyze symptoms using AI algorithms
- Get disease predictions with severity levels
- Receive personalized medicine recommendations
- Process orders with **Cash on Delivery (COD)** payment
- Maintain order and analysis history
- Track previous medical consultations

**⚠️ DISCLAIMER:** This is an AI-based suggestion system. Always consult a qualified healthcare professional for proper medical diagnosis and treatment.

---

## ✨ Features

### User Authentication
- User registration with username & password
- Secure login with JWT tokens
- Profile management
- Session management

### Symptom Analysis
- 30+ symptoms in English and Hindi
- Multiple disease classification (11+ diseases)
- Probability-based diagnosis
- Emergency alert notifications
- Category-based symptom filtering

### Medicine Recommendations
- Personalized medicine suggestions
- Dosage information
- Precautions and side effects
- Home remedy suggestions
- Price range information

### Shopping & Orders
- Add medicines to cart
- Persistent cart storage in database
- Checkout with delivery address
- Order confirmation
- Cash on Delivery (COD) support
- Order history and tracking

### Dashboard
- User profile
- Analysis history
- Order history
- Cart management

---

## 📁 Project Structure

```
artificial-doctor/
├── backend/                    # Express.js backend
│   ├── server.js              # Express server setup
│   ├── config.js              # Configuration & constants
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── analysis.js        # Analysis routes
│   │   ├── cart.js            # Cart routes
│   │   └── orders.js          # Order routes
│   ├── middleware/            # Middleware functions
│   ├── utils/
│   │   ├── password.js        # Password hashing utilities
│   │   ├── token.js           # JWT token utilities
│   │   ├── db.js              # Database operations
│   │   └── validation.js      # Input validation
│   └── package.json           # Backend dependencies
│
├── frontend/                   # Client-side application
│   ├── index.html             # Main HTML file
│   ├── style.css              # Styling
│   ├── js/
│   │   ├── main.js            # Application entry point
│   │   ├── api.js             # API client
│   │   ├── auth.js            # Frontend auth logic
│   │   ├── ui/                # UI components
│   │   └── utils/
│   │       ├── medical-data.js # Medical reference data
│   │       └── helpers.js      # Utility functions
│
├── database/
│   └── schema.sql             # PostgreSQL/Supabase schema
│
├── .env                       # Environment variables (IGNORED)
├── .env.example               # Environment example
├── .gitignore                 # Git ignore rules
├── package.json               # Root dependencies
└── README.md                  # This file
```

---

## 🚀 Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript (ES6+)
- Responsive Design
- Local Storage & API Communication

### Backend
- **Node.js** with **Express.js**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Express Rate Limit** for API protection

### Database
- **Supabase** (PostgreSQL)
- Real-time database operations
- Row Level Security (RLS)
- Automated backups

### Deployment Ready
- Vercel-compatible structure
- Environment variable configuration
- Production-ready security practices

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm (v8+)
- Git
- Supabase account

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/artificial-doctor.git
cd artificial-doctor

# Install dependencies
npm install
```

### Step 2: Environment Setup

```bash
# Copy environment example
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Update these values:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_strong_secret_key_min_32_chars
```

---

## 🗄️ Database Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and API keys to `.env`

### Step 2: Initialize Database

1. Go to Supabase SQL Editor
2. Open file: `database/schema.sql`
3. Copy entire SQL content
4. Paste into Supabase SQL Editor
5. Click "Execute"
6. Wait for tables to be created

### Verify Tables Created
```sql
-- Run in Supabase SQL Editor to verify
SELECT tablename FROM pg_tables 
WHERE schemaname='public';
```

Expected tables:
- `users`
- `analyses`
- `cart_items`
- `orders`
- `order_items`
- `symptom_records`
- `order_analyses`
- `audit_logs`

---

## 🌍 Environment Variables

```env
# Supabase Configuration
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Server Configuration
NODE_ENV=development        # development or production
PORT=3000
HOST=localhost

# Security
JWT_SECRET=your_secure_jwt_secret_key_here_min_32_chars
JWT_EXPIRY=7d
SESSION_SECRET=your_session_secret

# CORS
CORS_ORIGIN=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# App Configuration
APP_NAME=AI Doctor
APP_URL=http://localhost:3000
APP_DEBUG=true
```

---

## ▶️ Running the Application

### Development Mode

```bash
# Terminal 1: Start Backend
npm run dev

# Terminal 2: Open Frontend
# Open http://localhost:3000 in browser
```

### Production Mode

```bash
npm start
```

---

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "age": 25,
  "phone": "9876543210",
  "address": "123 Main St, City, State 12345",
  "fullName": "John Doe",
  "email": "john@example.com"
}

Response: 201 Created
{
  "message": "Registration successful",
  "user": { ... },
  "token": "eyJhbGc...",
  "expiresIn": "7d"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGc...",
  "expiresIn": "7d"
}
```

### Cart Management

#### Get Cart Items
```http
GET /api/cart
Authorization: Bearer {token}

Response: 200 OK
{
  "items": [ ... ],
  "total": 1500,
  "count": 3
}
```

#### Add to Cart
```http
POST /api/cart
Authorization: Bearer {token}
Content-Type: application/json

{
  "medicineName": "Paracetamol",
  "dosage": "500mg",
  "quantity": 2,
  "pricePerUnit": 25,
  "analysisId": "uuid"
}

Response: 201 Created
```

### Orders

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "deliveryAddress": "123 Main St, City",
  "phone": "9876543210"
}

Response: 201 Created
{
  "message": "Order placed successfully",
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-20231201-ABC123",
    "totalAmount": 1500,
    "status": "pending",
    "estimatedDelivery": "2023-12-06",
    "items": [ ... ]
  }
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer {token}

Response: 200 OK
{
  "orders": [ ... ],
  "count": 5
}
```

---

## 🚢 Deployment

### Deploy to Vercel

1. **Fork the repository**

2. **Connect to Vercel**
   ```bash
   vercel link
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env`

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy Backend to Heroku

```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy to AWS/Azure

Follow their respective documentation with Node.js deployment guides.

---

## 🔐 Security Notes

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens with 7-day expiry
- ✅ CORS enabled for specified origins only
- ✅ Rate limiting on all endpoints
- ✅ SQL injection prevention via Supabase
- ✅ Input validation and sanitization
- ✅ Helmet security headers
- ✅ HTTPS recommended for production

---

## 🚀 Future Enhancements

- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Google/Facebook login
- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] Doctor consultation booking
- [ ] Medical report PDF generation
- [ ] Admin dashboard for order management
- [ ] SMS notifications
- [ ] Mobile app (React Native/Flutter)
- [ ] AI model improvements
- [ ] Multi-language support
- [ ] Prescription upload
- [ ] Medicine prescription database
- [ ] Doctor ratings and reviews

---

## 📝 API Response Formats

### Success Response
```json
{
  "message": "Success message",
  "data": { ... },
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error information",
  "status": 400
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Submit pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues and suggestions:
- GitHub Issues: [report an issue](https://github.com/yourusername/artificial-doctor/issues)
- Email: support@doctorapp.com

---

## ⚕️ Medical Disclaimer

**This application is for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment.**

- Always consult with a qualified healthcare provider
- Seek emergency care for severe symptoms
- Follow your doctor's guidance over any app recommendations
- Do not delay professional medical care

---

**Made with ❤️ for better healthcare** | Version 1.0.0 | Last Updated: March 2026
