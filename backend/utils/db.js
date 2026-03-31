import { supabase, supabaseAdmin, DB_TABLES } from '../config.js';

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Get user by username
 */
export async function getUserByUsername(username) {
    const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .select('*')
        .eq('username', username)
        .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email) {
    const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .select('*')
        .eq('email', email.toLowerCase())
        .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
    const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

/**
 * Create new user
 */
export async function createUser(userData) {
    // Use admin client for registration to bypass RLS policies
    const { data, error } = await supabaseAdmin
        .from(DB_TABLES.USERS)
        .insert([userData])
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Update user
 */
export async function updateUser(userId, updateData) {
    const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

// ============================================
// ANALYSIS OPERATIONS
// ============================================

/**
 * Save analysis result
 */
export async function saveAnalysis(analysisData) {
    const { data, error } = await supabase
        .from(DB_TABLES.ANALYSES)
        .insert([analysisData])
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Get user's analyses
 */
export async function getUserAnalyses(userId, limit = 10) {
    const { data, error } = await supabase
        .from(DB_TABLES.ANALYSES)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (error) throw error;
    return data;
}

// ============================================
// CART OPERATIONS
// ============================================

/**
 * Get user's cart items
 */
export async function getCartItems(userId) {
    const { data, error } = await supabase
        .from(DB_TABLES.CART_ITEMS)
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false });
    
    if (error) throw error;
    return data;
}

/**
 * Add item to cart
 */
export async function addToCart(cartItem) {
    const { data, error } = await supabase
        .from(DB_TABLES.CART_ITEMS)
        .insert([cartItem])
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Update cart item
 */
export async function updateCartItem(cartItemId, updateData) {
    const { data, error } = await supabase
        .from(DB_TABLES.CART_ITEMS)
        .update(updateData)
        .eq('id', cartItemId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Remove cart item
 */
export async function removeCartItem(cartItemId) {
    const { error } = await supabase
        .from(DB_TABLES.CART_ITEMS)
        .delete()
        .eq('id', cartItemId);
    
    if (error) throw error;
    return true;
}

/**
 * Clear user's cart
 */
export async function clearCart(userId) {
    const { error } = await supabase
        .from(DB_TABLES.CART_ITEMS)
        .delete()
        .eq('user_id', userId);
    
    if (error) throw error;
    return true;
}

/**
 * Get cart total
 */
export async function getCartTotal(userId) {
    const items = await getCartItems(userId);
    return items.reduce((total, item) => total + (item.quantity * item.price_per_unit), 0);
}

// ============================================
// ORDER OPERATIONS
// ============================================

/**
 * Create order
 */
export async function createOrder(orderData) {
    const { data, error } = await supabase
        .from(DB_TABLES.ORDERS)
        .insert([orderData])
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId, limit = 20) {
    const { data, error } = await supabase
        .from(DB_TABLES.ORDERS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (error) throw error;
    return data;
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId) {
    const { data, error } = await supabase
        .from(DB_TABLES.ORDERS)
        .select('*')
        .eq('id', orderId)
        .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

/**
 * Get order items
 */
export async function getOrderItems(orderId) {
    const { data, error } = await supabase
        .from(DB_TABLES.ORDER_ITEMS)
        .select('*')
        .eq('order_id', orderId);
    
    if (error) throw error;
    return data;
}

/**
 * Create order items
 */
export async function createOrderItems(orderItems) {
    const { data, error } = await supabase
        .from(DB_TABLES.ORDER_ITEMS)
        .insert(orderItems)
        .select();
    
    if (error) throw error;
    return data;
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
        .from(DB_TABLES.ORDERS)
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

// ============================================
// AUDIT LOG OPERATIONS
// ============================================

/**
 * Log audit event
 */
export async function logAuditEvent(auditData) {
    const { error } = await supabase
        .from(DB_TABLES.AUDIT_LOGS)
        .insert([auditData]);
    
    if (error) throw error;
    return true;
}

export default {
    // User operations
    getUserByUsername,
    getUserById,
    createUser,
    updateUser,
    
    // Analysis operations
    saveAnalysis,
    getUserAnalyses,
    
    // Cart operations
    getCartItems,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartTotal,
    
    // Order operations
    createOrder,
    getUserOrders,
    getOrderById,
    getOrderItems,
    createOrderItems,
    updateOrderStatus,
    
    // Audit log operations
    logAuditEvent
};
