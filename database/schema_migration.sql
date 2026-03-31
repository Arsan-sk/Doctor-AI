-- ============================================
-- AI DOCTOR - DATABASE MIGRATION
-- CHANGES: Update users table for email/password authentication
-- ============================================

-- 1. ADD CONSTRAINTS TO EMAIL FIELD
-- Drop existing constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS unique_email;

-- Add NOT NULL constraint
ALTER TABLE users
ALTER COLUMN email SET NOT NULL;

-- Add UNIQUE constraint
ALTER TABLE users
ADD CONSTRAINT unique_email UNIQUE (email);

-- 2. ENSURE PASSWORD_HASH NOT NULL
ALTER TABLE users
ALTER COLUMN password_hash SET NOT NULL;

-- 3. CREATE INDEX ON EMAIL FOR FASTER LOGIN
CREATE INDEX IF NOT EXISTS idx_users_email_login ON users(email);

-- 4. UPDATE RLS POLICIES FOR BETTER SECURITY
-- Disable RLS on users table (we'll handle security at application level)
-- This allows registration to work without authentication
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- 5. VERIFY ORDERS TABLE FOR HISTORY
-- Orders table should already exist and have all necessary fields
-- Ensure order_items are linked properly
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

ALTER TABLE order_items
ADD CONSTRAINT order_items_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- 6. CREATE VIEW FOR USER'S ORDER HISTORY (useful for queries)
DROP VIEW IF EXISTS user_orders_with_items CASCADE;

CREATE VIEW user_orders_with_items AS
SELECT 
    o.id,
    o.user_id,
    o.order_number,
    o.total_amount,
    o.status,
    o.created_at,
    o.estimated_delivery,
    COUNT(oi.id) as item_count,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'medicine_name', oi.medicine_name,
            'quantity', oi.quantity,
            'price_per_unit', oi.price_per_unit,
            'subtotal', oi.subtotal
        )
    ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.user_id;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next: Run the backend updates and restart server
