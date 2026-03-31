// ============================================
// PERSISTENT CART & ORDER MANAGEMENT
// ============================================

import * as api from './api.js';
import * as helpers from './utils/helpers.js';

// Cart state for current session
export let persistentCartState = {
    items: [],
    selectedStore: null,
    currentOrder: null
};

// ============================================
// CART OPERATIONS
// ============================================

/**
 * Load cart from database
 */
export async function loadCartFromDB() {
    try {
        console.log('📦 Loading cart from DB...');
        const response = await api.cartAPI.getItems();
        persistentCartState.items = response.items || [];
        updateCartUI();
        return persistentCartState.items;
    } catch (error) {
        console.error('Error loading cart:', error);
        helpers.showToast('Error loading cart', 'error');
        return [];
    }
}

/**
 * Add item to cart (persistent)
 */
export async function addToCartPersistent(medicineName, quantity = 1, price = 100) {
    try {
        console.log(`➕ Adding ${quantity} of ${medicineName} to cart`);
        const response = await api.cartAPI.addItem({
            medicineName: medicineName,
            dosage: '',
            quantity: quantity,
            pricePerUnit: price
        });
        
        // After adding, reload full cart from server
        const updatedCart = await api.cartAPI.getItems();
        persistentCartState.items = updatedCart.items || [];
        updateCartUI();
        helpers.showToast(`${medicineName} added to cart! ✅`, 'success');
        return response;
    } catch (error) {
        console.error('Error adding to cart:', error);
        helpers.showToast('Failed to add to cart', 'error');
    }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(itemId, newQuantity) {
    try {
        if (newQuantity <= 0) {
            return removeFromCartPersistent(itemId);
        }
        
        const response = await api.cartAPI.updateItem(itemId, { quantity: newQuantity });
        // After updating, reload full cart from server
        const updatedCart = await api.cartAPI.getItems();
        persistentCartState.items = updatedCart.items || [];
        updateCartUI();
        return response;
    } catch (error) {
        console.error('Error updating cart item:', error);
        helpers.showToast('Failed to update quantity', 'error');
    }
}

/**
 * Remove item from cart
 */
export async function removeFromCartPersistent(itemId) {
    try {
        const response = await api.cartAPI.removeItem(itemId);
        // After removing, reload full cart from server
        const updatedCart = await api.cartAPI.getItems();
        persistentCartState.items = updatedCart.items || [];
        updateCartUI();
        helpers.showToast('Item removed from cart', 'info');
        return response;
    } catch (error) {
        console.error('Error removing from cart:', error);
        helpers.showToast('Failed to remove item', 'error');
    }
}

/**
 * Clear entire cart
 */
export async function clearCartPersistent() {
    try {
        await api.cartAPI.clearAll();
        persistentCartState.items = [];
        updateCartUI();
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
}

/**
 * Get cart total
 */
export async function getCartTotal() {
    try {
        const response = await api.cartAPI.getTotal();
        return response.total || 0;
    } catch (error) {
        console.error('Error getting cart total:', error);
        return 0;
    }
}

/**
 * Update cart UI after changes
 */
export function updateCartUI() {
    const total = persistentCartState.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count badges
    const cartCounts = document.querySelectorAll('[data-cart-count]');
    cartCounts.forEach(el => el.textContent = total);
    
    // Update results page cart button if exists
    const cartItemCount = document.getElementById('cartItemCount');
    if (cartItemCount) {
        cartItemCount.textContent = total;
    }
}

// ============================================
// ORDER OPERATIONS
// ============================================

/**
 * Create order from cart
 */
export async function createOrderFromCart(deliveryAddress, phone, selectedStoreId) {
    try {
        if (persistentCartState.items.length === 0) {
            helpers.showToast('Cart is empty', 'error');
            return null;
        }

        if (!selectedStoreId) {
            helpers.showToast('Please select a medical store', 'error');
            return null;
        }

        console.log('📦 Creating order...');

        // Prepare order data
        const orderData = {
            deliveryAddress: deliveryAddress,
            phone: phone,
            total_amount: persistentCartState.items.reduce((sum, item) => sum + (item.quantity * (item.pricePerUnit || 100)), 0),
            payment_method: 'cod',
            store_id: selectedStoreId,
            store_name: persistentCartState.selectedStore?.name,
            items: persistentCartState.items
        };

        const response = await api.orderAPI.create(orderData);
        
        // Store order for display
        persistentCartState.currentOrder = response.order;
        
        // Clear cart after successful order
        await clearCartPersistent();
        
        helpers.showToast('Order placed successfully!', 'success');
        return response.order;
    } catch (error) {
        console.error('Error creating order:', error);
        helpers.showToast(error.message || 'Failed to place order', 'error');
        return null;
    }
}

/**
 * Get user's order history
 */
export async function getOrderHistory() {
    try {
        const response = await api.orderAPI.getAll();
        return response.orders || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        helpers.showToast('Failed to load order history', 'error');
        return [];
    }
}

/**
 * Get order details
 */
export async function getOrderDetails(orderId) {
    try {
        const response = await api.orderAPI.getById(orderId);
        return response.order || null;
    } catch (error) {
        console.error('Error fetching order details:', error);
        helpers.showToast('Failed to load order details', 'error');
        return null;
    }
}

// ============================================
// STORE MANAGEMENT
// ============================================

/**
 * Get hardcoded list of nearby stores
 */
export function getNearbyStores() {
    return [
        {
            id: 'store_001',
            name: 'Medicare Plus',
            address: '123 Main Street, Downtown',
            phone: '+91-9876543210',
            color: '#FF6B6B'
        },
        {
            id: 'store_002',
            name: 'Health Hub',
            address: '456 Park Avenue, Midtown',
            phone: '+91-9876543211',
            color: '#4ECDC4'
        },
        {
            id: 'store_003',
            name: 'MediCare Express',
            address: '789 Oak Road, Uptown',
            phone: '+91-9876543212',
            color: '#45B7D1'
        },
        {
            id: 'store_004',
            name: 'Wellness Store',
            address: '321 Elm Street, Suburbs',
            phone: '+91-9876543213',
            color: '#96CEB4'
        }
    ];
}

/**
 * Select a store for order
 */
export function selectStore(storeId) {
    const stores = getNearbyStores();
    const selected = stores.find(s => s.id === storeId);
    
    if (selected) {
        persistentCartState.selectedStore = selected;
        console.log('✅ Store selected:', selected.name);
        return selected;
    }
    return null;
}

// ============================================
// UI RENDERING FUNCTIONS
// ============================================

/**
 * Render cart items on My Cart tab
 */
export function renderMyCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartItemsContainer) return;

    if (persistentCartState.items.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (emptyCart) emptyCart.classList.remove('hidden');
        if (cartSummary) cartSummary.classList.add('hidden');
        return;
    }

    if (emptyCart) emptyCart.classList.add('hidden');
    if (cartSummary) cartSummary.classList.remove('hidden');

    cartItemsContainer.innerHTML = '';
    let totalQty = 0, totalPrice = 0;

    persistentCartState.items.forEach((item, idx) => {
        totalQty += item.quantity;
        const itemPrice = item.quantity * (item.pricePerUnit || 100);
        totalPrice += itemPrice;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.medicineName}</h4>
                <p>${item.dosage || 'Standard dosage'}</p>
                <p class="price">₹${item.pricePerUnit || 100}/unit</p>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn qty-decrease" data-item-id="${item.id}">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn qty-increase" data-item-id="${item.id}">+</button>
            </div>
            <div class="item-subtotal">₹${itemPrice}</div>
            <button class="btn btn--sm btn--danger remove-item" data-item-id="${item.id}">🗑️ Remove</button>
        `;
        
        cartItemsContainer.appendChild(itemDiv);

        // Add event listeners
        itemDiv.querySelector('.qty-decrease')?.addEventListener('click', async () => {
            await updateCartItemQuantity(item.id, item.quantity - 1);
            renderMyCart();
        });

        itemDiv.querySelector('.qty-increase')?.addEventListener('click', async () => {
            await updateCartItemQuantity(item.id, item.quantity + 1);
            renderMyCart();
        });

        itemDiv.querySelector('.remove-item')?.addEventListener('click', async () => {
            await removeFromCartPersistent(item.id);
            renderMyCart();
        });
    });

    // Update totals
    const totalItemsEl = document.getElementById('totalItems');
    const totalAmountEl = document.getElementById('totalAmount');
    if (totalItemsEl) totalItemsEl.textContent = totalQty;
    if (totalAmountEl) totalAmountEl.textContent = '₹' + totalPrice;
}

/**
 * Render order history tab
 */
export async function renderOrderHistory() {
    const orderHistoryList = document.getElementById('orderHistoryList');
    
    if (!orderHistoryList) return;

    orderHistoryList.innerHTML = '<p class="loading">Loading orders...</p>';

    try {
        const orders = await getOrderHistory();

        if (orders.length === 0) {
            orderHistoryList.innerHTML = '<p class="empty-message">No orders yet. Start by analyzing symptoms!</p>';
            return;
        }

        orderHistoryList.innerHTML = '';

        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-history-item';
            
            const statusColor = {
                pending: '#FFA500',
                confirmed: '#4ECDC4',
                shipped: '#45B7D1',
                delivered: '#96CEB4',
                cancelled: '#FF6B6B'
            }[order.status] || '#999';

            orderDiv.innerHTML = `
                <div class="order-header">
                    <div class="order-info">
                        <h4>Order #${order.orderNumber}</h4>
                        <p class="order-date">${new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="order-amount">
                        <span class="amount">₹${order.totalAmount}</span>
                        <span class="status" style="background: ${statusColor}">${order.status}</span>
                    </div>
                </div>
                <div class="order-details-btn">
                    <button class="btn btn--sm btn--secondary view-order-details" data-order-id="${order.id}">
                        View Details
                    </button>
                </div>
            `;

            orderHistoryList.appendChild(orderDiv);

            orderDiv.querySelector('.view-order-details')?.addEventListener('click', async () => {
                await showOrderDetailsModal(order.id);
            });
        });
    } catch (error) {
        console.error('Error rendering order history:', error);
        orderHistoryList.innerHTML = '<p class="error-message">Failed to load orders</p>';
    }
}

/**
 * Show order details in modal/expandable
 */
export async function showOrderDetailsModal(orderId) {
    const orderDetails = await getOrderDetails(orderId);
    
    if (!orderDetails) {
        helpers.showToast('Failed to load order details', 'error');
        return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Order Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h4>Order Information</h4>
                    <div class="detail-row">
                        <span class="label">Order Number:</span>
                        <span class="value">${orderDetails.orderNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Status:</span>
                        <span class="value">${orderDetails.status}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Total Amount:</span>
                        <span class="value">₹${orderDetails.totalAmount}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Items</h4>
                    <div class="items-list">
                        ${orderDetails.items.map(item => `
                            <div class="item-row">
                                <span>${item.medicineName}</span>
                                <span>Qty: ${item.quantity}</span>
                                <span>₹${item.subtotal}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Delivery Details</h4>
                    <div class="detail-row">
                        <span class="label">Address:</span>
                        <span class="value">${orderDetails.deliveryAddress}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Phone:</span>
                        <span class="value">${orderDetails.phone}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn--secondary close-modal">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('.close-modal')?.addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay')?.addEventListener('click', () => modal.remove());
}

// ============================================
// STORE UI RENDERING
// ============================================

/**
 * Render store selection in checkout
 */
export function renderStoreSelection() {
    const storesGrid = document.getElementById('storesGrid');
    if (!storesGrid) return;

    const stores = getNearbyStores();
    storesGrid.innerHTML = '';

    stores.forEach(store => {
        const storeCard = document.createElement('div');
        storeCard.className = 'store-card';
        storeCard.style.borderColor = store.color;
        storeCard.innerHTML = `
            <input type="radio" name="store" value="${store.id}" class="store-radio">
            <div class="store-header" style="background: ${store.color}">
                <h4>${store.name}</h4>
            </div>
            <div class="store-details">
                <p class="address">📍 ${store.address}</p>
                <p class="phone">📞 ${store.phone}</p>
            </div>
        `;

        storeCard.addEventListener('click', () => {
            const radio = storeCard.querySelector('.store-radio');
            if (radio) radio.checked = true;
            selectStore(store.id);
            // Highlight selected
            document.querySelectorAll('.store-card').forEach(card => card.classList.remove('selected'));
            storeCard.classList.add('selected');
        });

        storesGrid.appendChild(storeCard);
    });
}

/**
 * Render stores grid for My Cart tab
 */
export function renderStoresInCart() {
    const cartStoresGrid = document.getElementById('cartStoresGrid');
    if (!cartStoresGrid) return;

    const stores = getNearbyStores();
    cartStoresGrid.innerHTML = '';

    stores.forEach(store => {
        const storeCard = document.createElement('div');
        storeCard.className = 'store-card-cart';
        storeCard.style.borderColor = store.color;
        storeCard.innerHTML = `
            <input type="radio" name="cart-store" value="${store.id}" class="store-radio">
            <div class="store-header-cart" style="background: ${store.color}">
                <h5>${store.name}</h5>
            </div>
            <div class="store-info">
                <p>📍 ${store.address}</p>
                <p>📞 ${store.phone}</p>
            </div>
        `;

        storeCard.querySelector('.store-radio')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectStore(store.id);
                document.querySelectorAll('.store-card-cart').forEach(card => card.classList.remove('selected'));
                storeCard.classList.add('selected');
            }
        });

        cartStoresGrid.appendChild(storeCard);
    });
}

/**
 * Render checkout summary
 */
export function renderCheckoutSummary() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (!checkoutItemsContainer) return;

    checkoutItemsContainer.innerHTML = '';
    let totalPrice = 0;

    persistentCartState.items.forEach(item => {
        totalPrice += item.quantity * (item.pricePerUnit || 100);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checkout-item';
        itemDiv.innerHTML = `
            <div class="item-details">
                <h5>${item.medicineName}</h5>
                <p>₹${item.pricePerUnit || 100} × ${item.quantity}</p>
            </div>
            <div class="item-price">₹${item.quantity * (item.pricePerUnit || 100)}</div>
        `;
        checkoutItemsContainer.appendChild(itemDiv);
    });

    if (checkoutSubtotal) checkoutSubtotal.textContent = '₹' + totalPrice;
    if (checkoutTotal) checkoutTotal.textContent = '₹' + totalPrice;
}

/**
 * Display order placed information
 */
export function displayOrderPlaced(order) {
    const orderNumber = document.getElementById('orderNumber');
    const orderTotal = document.getElementById('orderTotal');
    const storeName = document.getElementById('storeName');
    const deliveryAddr = document.getElementById('deliveryAddr');
    const deliveryEst = document.getElementById('deliveryEst');

    if (orderNumber) orderNumber.textContent = order.orderNumber || '#' + order.id;
    if (orderTotal) orderTotal.textContent = '₹' + order.totalAmount;
    if (storeName) storeName.textContent = order.storeName || persistentCartState.selectedStore?.name || '-';
    if (deliveryAddr) deliveryAddr.textContent = order.deliveryAddress || '-';
    
    // Calculate estimated delivery (next business day)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (deliveryEst) deliveryEst.textContent = tomorrow.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Display order tracking page
 */
export function displayOrderTracking(order) {
    const trackOrderNumber = document.getElementById('trackOrderNumber');
    const trackOrderTotal = document.getElementById('trackOrderTotal');
    const trackDeliveryAddr = document.getElementById('trackDeliveryAddr');
    const trackStoreName = document.getElementById('trackStoreName');

    if (trackOrderNumber) trackOrderNumber.textContent = order.orderNumber || '#' + order.id;
    if (trackOrderTotal) trackOrderTotal.textContent = '₹' + order.totalAmount;
    if (trackDeliveryAddr) trackDeliveryAddr.textContent = order.deliveryAddress || '-';
    if (trackStoreName) trackStoreName.textContent = order.storeName || persistentCartState.selectedStore?.name || '-';
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

export default {
    loadCartFromDB,
    addToCartPersistent,
    updateCartItemQuantity,
    removeFromCartPersistent,
    clearCartPersistent,
    getCartTotal,
    updateCartUI,
    createOrderFromCart,
    getOrderHistory,
    getOrderDetails,
    selectStore,
    getNearbyStores,
    renderMyCart,
    renderOrderHistory,
    renderStoreSelection,
    renderCheckoutSummary,
    displayOrderPlaced,
    displayOrderTracking,
    persistentCartState
};
