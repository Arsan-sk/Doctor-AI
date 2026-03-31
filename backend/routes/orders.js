import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../utils/token.js';
import { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    getOrderItems,
    createOrderItems,
    updateOrderStatus,
    getCartItems,
    clearCart
} from '../utils/db.js';
import { validateAddress } from '../utils/validation.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS, config } from '../config.js';

const router = express.Router();

// ============================================
// GET USER ORDERS
// ============================================

router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await getUserOrders(req.userId);

        res.status(HTTP_STATUS.OK).json({
            orders: orders.map(order => ({
                id: order.id,
                orderNumber: order.order_number,
                totalAmount: order.total_amount,
                status: order.status,
                deliveryAddress: order.delivery_address,
                createdAt: order.created_at,
                estimatedDelivery: order.estimated_delivery
            })),
            count: orders.length
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// GET ORDER BY ID
// ============================================

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await getOrderById(id);

        if (!order || order.user_id !== req.userId) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                error: ERROR_MESSAGES.NOT_FOUND
            });
        }

        const items = await getOrderItems(id);

        res.status(HTTP_STATUS.OK).json({
            order: {
                id: order.id,
                orderNumber: order.order_number,
                totalAmount: order.total_amount,
                status: order.status,
                paymentMethod: order.payment_method,
                deliveryAddress: order.delivery_address,
                phone: order.phone,
                notes: order.notes,
                createdAt: order.created_at,
                estimatedDelivery: order.estimated_delivery,
                deliveredAt: order.delivered_at,
                items: items.map(item => ({
                    medicineName: item.medicine_name,
                    quantity: item.quantity,
                    pricePerUnit: item.price_per_unit,
                    subtotal: item.subtotal
                }))
            }
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// CREATE ORDER (CHECKOUT)
// ============================================

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { deliveryAddress, phone } = req.body;

        // Validate input
        if (!deliveryAddress || !phone) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: ERROR_MESSAGES.MISSING_FIELDS
            });
        }

        // Validate address
        const addressValidation = validateAddress(deliveryAddress);
        if (!addressValidation.valid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: addressValidation.message
            });
        }

        // Get cart items
        const cartItems = await getCartItems(req.userId);

        if (cartItems.length === 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Cart is empty'
            });
        }

        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (item.quantity * item.price_per_unit);
        }, 0);

        // Validate order amount
        if (totalAmount < config.pricing.minOrderAmount || totalAmount > config.pricing.maxOrderAmount) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: `Order amount must be between ₹${config.pricing.minOrderAmount} and ₹${config.pricing.maxOrderAmount}`
            });
        }

        // Generate order number
        const orderNumber = `ORD-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Calculate estimated delivery date (5-7 days)
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 5);

        // Create order
        const order = await createOrder({
            user_id: req.userId,
            order_number: orderNumber,
            delivery_address: deliveryAddress.trim(),
            phone: phone.trim(),
            total_amount: totalAmount,
            status: 'pending',
            payment_method: 'cod',
            estimated_delivery: estimatedDelivery.toISOString().split('T')[0]
        });

        // Create order items
        const orderItemsData = cartItems.map(item => ({
            order_id: order.id,
            medicine_name: item.medicine_name,
            dosage: item.dosage,
            quantity: item.quantity,
            price_per_unit: item.price_per_unit,
            subtotal: item.quantity * item.price_per_unit
        }));

        await createOrderItems(orderItemsData);

        // Clear cart
        await clearCart(req.userId);

        res.status(HTTP_STATUS.CREATED).json({
            message: SUCCESS_MESSAGES.ORDER_PLACED,
            order: {
                id: order.id,
                orderNumber: order.order_number,
                totalAmount: order.total_amount,
                status: order.status,
                estimatedDelivery: order.estimated_delivery,
                deliveryAddress: order.delivery_address,
                createdAt: order.created_at,
                items: orderItemsData
            }
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR,
            message: error.message
        });
    }
});

// ============================================
// CANCEL ORDER (ADMIN/USER ONLY PENDING)
// ============================================

router.put('/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await getOrderById(id);

        if (!order || order.user_id !== req.userId) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                error: ERROR_MESSAGES.NOT_FOUND
            });
        }

        // Only allow cancellation of pending orders
        if (order.status !== 'pending') {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: `Cannot cancel ${order.status} order`
            });
        }

        // Update order status
        const updatedOrder = await updateOrderStatus(id, 'cancelled');

        res.status(HTTP_STATUS.OK).json({
            message: 'Order cancelled successfully',
            order: {
                orderNumber: updatedOrder.order_number,
                status: updatedOrder.status
            }
        });

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// UPDATE ORDER STATUS (ADMIN ONLY - implement with admin auth)
// ============================================

router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // TODO: Add admin authentication check here

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Invalid status'
            });
        }

        const updatedOrder = await updateOrderStatus(id, status);

        res.status(HTTP_STATUS.OK).json({
            message: 'Order status updated',
            order: {
                orderNumber: updatedOrder.order_number,
                status: updatedOrder.status
            }
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

export default router;
