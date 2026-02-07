const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getCart, addItem, updateItem, removeItem } = require('../controllers/cartController');

const cartRouter = Router();

cartRouter.get('/', authMiddleware, getCart);
cartRouter.post('/items', authMiddleware, addItem);
cartRouter.put('/items/:itemId', authMiddleware, updateItem);
cartRouter.delete('/items/:itemId', authMiddleware, removeItem);

module.exports = cartRouter;

