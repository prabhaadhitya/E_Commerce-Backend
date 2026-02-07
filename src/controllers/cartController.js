const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Product = require('../models/product');
const { sequelize } = require('../config/sequelize');

const getCart = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId });
        }
        const items = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [{ model: Product }],
            order: [['id', 'ASC']]
        });
        res.status(200).json({ cart, items });
    } catch (error) {
        console.log('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addItem = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            await t.rollback();
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const productId = parseInt(req.body.productId);  
        const qty = parseInt(req.body.qty);      
        if (!productId) {
            await t.rollback();
            return res.status(400).json({ message: 'Product ID is required' });
        }
        if (!qty || qty <= 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Quantity must be greater than zero' });
        }
        let cart = await Cart.findOne({ where: { userId }, transaction: t });
        if (!cart) {
            cart = await Cart.create({ userId }, { transaction: t });
        }

        const product = await Product.findByPk(productId, { transaction: t });
        if (!product) {
            await t.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        let item = await CartItem.findOne({ where: { cartId: cart.id, productId }, transaction: t });
        if (item) {
            const newQty = item.qty + qty;
            if (newQty > product.stock) {
                await t.rollback();
                return res.status(400).json({ message: 'Insufficient stock available' });
            }
            item.qty = newQty;
            await item.save({ transaction: t });
        } else { 
            if (qty > product.stock) {
                await t.rollback();
                return res.status(400).json({ message: 'Insufficient stock available' });
            }
            item = await CartItem.create({ 
                cartId: cart.id, 
                productId, 
                qty, 
                priceSnapshotCents: product.priceCents,
            }, { transaction: t });
        }
        await t.commit();
        const returned = await CartItem.findByPk(item.id, { include: [{ model: Product }] });
        res.status(200).json({ message: 'Item added to cart', item: returned });    
    } catch (error) {
        try {
            await t.rollback();
        } catch (error) {
            console.log('Error rolling back transaction:', error);
        }
        console.log('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateItem = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            await t.rollback();
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const itemId = parseInt(req.params.itemId);
        const newQty = parseInt(req.body.qty);
        if (!itemId) {
            await t.rollback();
            return res.status(400).json({ message: 'Item ID is required' });
        }
        if (!newQty || newQty <= 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Quantity must be greater than zero' });
        }
        const item = await CartItem.findByPk(itemId, { transaction: t });
        if (!item) {
            await t.rollback();
            return res.status(404).json({ message: 'Item not found' });
        }
        const cart = await Cart.findByPk(item.cartId, { transaction: t });
        if (!cart || cart.userId !== userId) {
            await t.rollback();
            return res.status(403).json({ message: 'Forbidden' });
        }
        const product = await Product.findByPk(item.productId, { transaction: t });
        if (!product) {
            await t.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }
        if (newQty < 0) {
            await item.destroy({ transaction: t });
            await t.commit();
            return res.status(400).json({ message: 'Removed item from cart' });
        }
        if (newQty > product.stock) {
            await t.rollback();
            return res.status(400).json({ message: 'Insufficient stock available' });
        }
        item.qty = newQty;
        await item.save({ transaction: t });
        await t.commit();
        const returned = await CartItem.findByPk(item.id, { include: [{ model: Product }] });
        res.status(200).json({ message: 'Item updated in cart', item: returned });
    } catch (error) {
        try {
            await t.rollback();
        } catch (error) {
            console.log('Error rolling back transaction:', error);
        }
        console.log('Error updating item in cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeItem = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const itemId = parseInt(req.params.itemId);
        if (!itemId) {
            return res.status(400).json({ message: 'Item ID is required' });
        }
        const item = await CartItem.findByPk(itemId, { include: [{ model: Cart }] });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const cart = await Cart.findByPk(item.cartId);
        if (!cart || cart.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await item.destroy();
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.log('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getCart, addItem, updateItem, removeItem };