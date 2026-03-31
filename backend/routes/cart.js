import express from 'express';
import { authenticateToken } from '../utils/token.js';
import { 
    getCartItems, 
    addToCart, 
    updateCartItem, 
    removeCartItem, 
    clearCart,
    getCartTotal 
} from '../utils/db.js';
import { validateQuantity } from '../utils/validation.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS } from '../config.js';

const router = express.Router();

// ============================================
// GET CART ITEMS
// ============================================

router.get('/', authenticateToken, async (req, res) => {
    try {
        const items = await getCartItems(req.userId);
        const total = await getCartTotal(req.userId);

        res.status(HTTP_STATUS.OK).json({
            items: items.map(item => ({
                id: item.id,
                medicineName: item.medicine_name,
                dosage: item.dosage,
                quantity: item.quantity,
                pricePerUnit: item.price_per_unit,
                subtotal: item.quantity * item.price_per_unit,
                addedAt: item.added_at
            })),
            total,
            count: items.length
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// ADD TO CART
// ============================================

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { medicineName, dosage, quantity, pricePerUnit, analysisId } = req.body;

        // Validate input
        if (!medicineName || !quantity || !pricePerUnit) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: ERROR_MESSAGES.MISSING_FIELDS
            });
        }

        // Validate quantity
        const qtyValidation = validateQuantity(quantity);
        if (!qtyValidation.valid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: qtyValidation.message
            });
        }

        // Add item to cart
        const cartItem = await addToCart({
            user_id: req.userId,
            analysis_id: analysisId || null,
            medicine_name: medicineName.trim(),
            dosage: dosage || null,
            quantity: parseInt(quantity),
            price_per_unit: parseFloat(pricePerUnit)
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: 'Item added to cart',
            item: {
                id: cartItem.id,
                medicineName: cartItem.medicine_name,
                dosage: cartItem.dosage,
                quantity: cartItem.quantity,
                pricePerUnit: cartItem.price_per_unit,
                subtotal: cartItem.quantity * cartItem.price_per_unit
            }
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// UPDATE CART ITEM
// ============================================

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: 'Quantity is required'
            });
        }

        // Validate quantity
        const qtyValidation = validateQuantity(quantity);
        if (!qtyValidation.valid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: qtyValidation.message
            });
        }

        // Update cart item
        const updatedItem = await updateCartItem(id, {
            quantity: parseInt(quantity)
        });

        res.status(HTTP_STATUS.OK).json({
            message: SUCCESS_MESSAGES.CART_UPDATED,
            item: {
                id: updatedItem.id,
                medicineName: updatedItem.medicine_name,
                quantity: updatedItem.quantity,
                pricePerUnit: updatedItem.price_per_unit,
                subtotal: updatedItem.quantity * updatedItem.price_per_unit
            }
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// REMOVE FROM CART
// ============================================

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await removeCartItem(id);

        res.status(HTTP_STATUS.OK).json({
            message: 'Item removed from cart'
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// CLEAR CART
// ============================================

router.delete('/', authenticateToken, async (req, res) => {
    try {
        await clearCart(req.userId);

        res.status(HTTP_STATUS.OK).json({
            message: 'Cart cleared successfully'
        });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// GET CART TOTAL
// ============================================

router.get('/total', authenticateToken, async (req, res) => {
    try {
        const total = await getCartTotal(req.userId);
        const items = await getCartItems(req.userId);

        res.status(HTTP_STATUS.OK).json({
            total,
            itemCount: items.length,
            estimatedDeliveryCharge: 0,
            grandTotal: total
        });

    } catch (error) {
        console.error('Get cart total error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

export default router;
