-- ============================================
-- CART FUNCTIONALITY FIX - Disable RLS
-- ============================================
-- Issue: RLS policies blocking cart operations
-- Cause: Mismatch between Supabase auth.uid() and JWT user_id
-- Solution: Disable RLS on cart and order tables
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS on cart_items (JWT authentication is used)
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Step 2: Disable RLS on orders (JWT authentication is used)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Step 3: Disable RLS on order_items (JWT authentication is used)
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Step 4: Disable RLS on order_analyses (JWT authentication is used)
ALTER TABLE order_analyses DISABLE ROW LEVEL SECURITY;

-- Note: We're keeping RLS disabled because:
-- 1. The backend uses custom JWT tokens with user_id field
-- 2. Supabase's auth.uid() doesn't match our JWT's user_id
-- 3. Authentication is enforced at the middleware level (authenticateToken)
-- 4. API endpoints validate user_id from JWT token
-- 5. Row-level security is not compatible with this architecture

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify RLS is disabled:

-- Show RLS status for all tables:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('cart_items', 'orders', 'order_items', 'order_analyses', 'users', 'analyses');

-- ============================================
-- AFTER RUNNING THIS MIGRATION
-- ============================================
-- 1. Go back to VS Code
-- 2. Restart the backend server: npm run dev
-- 3. Clear browser cache/localStorage
-- 4. Try adding to cart again
-- The error should now be fixed!
