import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';

// Import routes
import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Parse JSON requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    skipSuccessfulRequests: true,
    message: 'Too many login attempts, please try again later.'
});

// ============================================
// STATIC FILES & SPA ROUTING
// ============================================
app.use(express.static(join(__dirname, '../frontend')));

// SPA fallback - serve index.html for all non-API routes
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/index.html'));
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ============================================
// ROUTES
// ============================================

// Authentication routes
app.use('/api/auth', authLimiter, authRoutes);

// Analysis routes
app.use('/api/analysis', analysisRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/index.html'));
});

// Alternative 404 for non-GET requests
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        message: 'The requested endpoint does not exist'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(status).json({ 
        error: message,
        status,
        timestamp: new Date().toISOString()
    });
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Flag to track if server is listening
let isListening = false;

const server = app.listen(PORT, HOST, () => {
    isListening = true;
    console.log(`
╔════════════════════════════════════════╗
║    🩺 AI Doctor - Backend Server      ║
╚════════════════════════════════════════╝
    
Server running on: http://${HOST}:${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Database: Supabase (${process.env.SUPABASE_URL})

Available endpoints:
  GET    /api/health                   - Server health check
  POST   /api/auth/register            - User registration
  POST   /api/auth/login               - User login
  POST   /api/auth/logout              - User logout
  GET    /api/analysis/:id             - Get analysis
  POST   /api/analysis                 - Create analysis
  GET    /api/cart                     - Get cart items
  POST   /api/cart                     - Add to cart
  DELETE /api/cart/:id                 - Remove from cart
  PUT    /api/cart/:id                 - Update cart item
  GET    /api/orders                   - Get user orders
  POST   /api/orders                   - Create order
  GET    /api/orders/:id               - Get order details
`);
});

// Handle port already in use error
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use.`);
        console.log(`ℹ️  Attempting to kill existing process on port ${PORT}...\n`);
        
        // Try to kill existing process
        if (process.platform === 'win32') {
            // Windows: Use PowerShell to find and kill
            exec(`Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue`, 
                { shell: 'powershell.exe' }, 
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error killing process:', error.message);
                    } else {
                        console.log(`✅ Old process killed. Exiting - nodemon will restart automatically.`);
                    }
                    process.exit(1); // Exit so nodemon restarts
                }
            );
        } else {
            // macOS/Linux: Use lsof
            exec(`lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true`, (error) => {
                console.log(`✅ Old process killed. Exiting - nodemon will restart automatically.`);
                process.exit(1); // Exit so nodemon restarts
            });
        }
    } else {
        console.error('Server error:', err.message);
        process.exit(1);
    }
});

// Prevent double listen calls
server.once('listening', () => {
    console.log(`\n✅ Server successfully started on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received, closing server gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received, closing server gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

export default app;
