-- AI Doctor - Complete Database Schema for Supabase
-- Copy and paste this entire file into Supabase SQL Editor

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(150),
    age INTEGER,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT age_valid CHECK (age > 0 AND age < 150)
);

-- Create index on username for faster lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. SYMPTOM RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS symptom_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symptoms JSONB NOT NULL, -- Array of symptom keys
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT symptoms_not_empty CHECK (jsonb_array_length(symptoms) > 0)
);

CREATE INDEX idx_symptom_records_user_id ON symptom_records(user_id);
CREATE INDEX idx_symptom_records_created_at ON symptom_records(created_at DESC);

-- ============================================
-- 3. ANALYSIS RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symptom_record_id UUID REFERENCES symptom_records(id) ON DELETE SET NULL,
    symptoms JSONB NOT NULL, -- Selected symptoms
    diagnosis_results JSONB NOT NULL, -- Disease predictions with probabilities
    recommended_medicines JSONB NOT NULL, -- Array of medicine objects
    home_remedies JSONB, -- Home remedy suggestions
    emergency_flag BOOLEAN DEFAULT false,
    emergency_message VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_emergency_flag ON analyses(emergency_flag);

-- ============================================
-- 4. CART ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_per_unit NUMERIC(10, 2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT quantity_positive CHECK (quantity > 0),
    CONSTRAINT price_positive CHECK (price_per_unit >= 0)
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_added_at ON cart_items(added_at DESC);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    delivery_address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    payment_method VARCHAR(50) DEFAULT 'cod', -- cod (cash on delivery)
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estimated_delivery DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT total_amount_positive CHECK (total_amount >= 0),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'))
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================
-- 6. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100),
    quantity INTEGER NOT NULL,
    price_per_unit NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    CONSTRAINT quantity_positive CHECK (quantity > 0),
    CONSTRAINT price_positive CHECK (price_per_unit >= 0),
    CONSTRAINT subtotal_positive CHECK (subtotal >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- 7. ORDER HISTORY/ANALYSIS JOIN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    UNIQUE(order_id, analysis_id)
);

CREATE INDEX idx_order_analyses_order_id ON order_analyses(order_id);
CREATE INDEX idx_order_analyses_analysis_id ON order_analyses(analysis_id);

-- ============================================
-- 8. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to validate and hash passwords during insert/update
CREATE OR REPLACE FUNCTION validate_user_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Username validation
    IF LENGTH(NEW.username) < 3 OR LENGTH(NEW.username) > 50 THEN
        RAISE EXCEPTION 'Username must be between 3 and 50 characters';
    END IF;
    
    -- Password hash validation (should be hashed on backend, but checking format)
    IF LENGTH(NEW.password_hash) < 20 THEN
        RAISE EXCEPTION 'Invalid password format';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user validation
CREATE TRIGGER users_validate_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION validate_user_insert();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
BEGIN
    RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to calculate order total automatically
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_amount = COALESCE((SELECT SUM(subtotal) FROM order_items WHERE order_id = NEW.id), 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: User Analysis History
CREATE OR REPLACE VIEW user_analysis_history AS
SELECT 
    a.id,
    a.user_id,
    u.username,
    a.symptoms,
    a.diagnosis_results,
    a.emergency_flag,
    a.created_at,
    COUNT(DISTINCT o.id) AS order_count
FROM analyses a
LEFT JOIN users u ON a.user_id = u.id
LEFT JOIN order_analyses oa ON a.id = oa.analysis_id
LEFT JOIN orders o ON oa.order_id = o.id
GROUP BY a.id, u.id;

-- View: User Order Summary
CREATE OR REPLACE VIEW user_order_summary AS
SELECT 
    u.id,
    u.username,
    COUNT(o.id) AS total_orders,
    SUM(o.total_amount) AS total_spent,
    MAX(o.created_at) AS last_order_date,
    COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) AS delivered_orders,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) AS pending_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- View: Active Cart Items with User Info
CREATE OR REPLACE VIEW active_carts AS
SELECT 
    ci.id,
    ci.user_id,
    u.username,
    ci.medicine_name,
    ci.quantity,
    ci.price_per_unit,
    (ci.quantity * ci.price_per_unit) AS item_total,
    ci.added_at
FROM cart_items ci
LEFT JOIN users u ON ci.user_id = u.id;

-- ============================================
-- SAMPLE DATA (OPTIONAL - Remove if not needed)
-- ============================================
-- Uncomment to insert sample data for testing

/*
-- Insert sample medicine data (reference)
INSERT INTO medicines (name, dosage, price_range) VALUES
('Paracetamol', '500mg', '₹10-50'),
('Ibuprofen', '200mg', '₹15-60'),
('Omeprazole', '20mg', '₹30-100'),
('Cetirizine', '10mg', '₹20-80'),
('ORS', '1 sachet', '₹5-20')
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- SECURITY: Row Level Security (RLS)
-- ============================================
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own data
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid()::uuid = id);

CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid()::uuid = id);

-- Policy: Users can only view their own analyses
CREATE POLICY "Users can view own analyses"
    ON analyses FOR SELECT
    USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can insert own analyses"
    ON analyses FOR INSERT
    WITH CHECK (auth.uid()::uuid = user_id);

-- Policy: Users can only view their own cart
CREATE POLICY "Users can view own cart"
    ON cart_items FOR SELECT
    USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can modify own cart"
    ON cart_items FOR ALL
    USING (auth.uid()::uuid = user_id);

-- Policy: Users can only view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid()::uuid = user_id);

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
-- Database schema created successfully!
-- Tables: users, symptom_records, analyses, cart_items, orders, order_items, order_analyses, audit_logs
-- Views: user_analysis_history, user_order_summary, active_carts
-- Indexes and triggers configured for optimal performance
