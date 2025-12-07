const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Product = require('../models/product');
const { sequelize } = require('../config/sequelize');

const checkout = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            await t.rollback();
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const cart = await Cart.findOne({ 
            where: { userId },
            include: [{ model: CartItem, include: [Product] }],
            transaction: t 
        });
        if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Cart is empty' });
        }
        let totalCents = 0;
        for (const item of cart.CartItems) {
            const product = item.Product;
            if(!product) {
                await t.rollback();
                return res.status(400).json({ message: `Product not found for cart item ID ${item.id}` });
            }
            if(item.qty > product.stock) {
                await t.rollback();
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
            }
            totalCents += item.quantity * item.priceSnapshotCents;
        }
        
        const shippingAddress = req.body.shippingAddress || null;
        const order = await Order.create({
            userId,
            totalCents,
            status: 'PAID',
            shippingAddress,
            paymentMeta: { method: 'mock' },
        }, { transaction: t });

        const orderItemsData = cart.CartItems.map(it => ({
            orderId: order.id,
            productId: it.productId,
            qty: it.qty,
            priceCents: it.priceSnapshotCents,
        }));
        await OrderItem.bulkCreate(orderItemsData, { transaction: t });

        for (const ci of cart.CartItems) {
            const product = ci.Product;
            product.stock -= ci.qty;
            await product.save({ transaction: t });
        }

        await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
        await t.commit();

        const createdOrder = await Order.findByPk(order.id);
        res.status(201).json({ message: 'Checkout successful', orderId: order.id, order: createdOrder });
    } catch (error) {
        try {
            await t.rollback();
        } catch (err) {
            console.log('Rollback failed:', err);
        }
        console.log('Checkout error: ',error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const listOrders = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const orders = await Order.findAll({ where: { userId } });
        res.status(200).json({ orders });
    } catch (error) {
        console.log('List orders error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getOrder = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Order ID is required' });
        }
        const order = await Order.findByPk(id, { include: [OrderItem] });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.status(200).json({ order });
    } catch (error) {
        console.log('Get order error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { checkout, listOrders, getOrder };