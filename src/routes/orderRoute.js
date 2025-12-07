const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { checkout, listOrders, getOrder } = require('../controllers/orderController');

const orderRouter = Router();

orderRouter.post('/checkout', authMiddleware, checkout);
orderRouter.get('/', authMiddleware, listOrders);
orderRouter.get('/:id', authMiddleware, getOrder);

module.exports = orderRouter;
