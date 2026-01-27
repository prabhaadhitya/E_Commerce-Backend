const { Router } = require('express');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');
const { list, get, create } = require('../controllers/productController');

const productRouter = Router();

productRouter.get('/', authMiddleware, list);
productRouter.get('/:id', authMiddleware, get);
productRouter.post('/admin', authMiddleware, requireAdmin, create);

module.exports = productRouter;

