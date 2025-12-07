const { Router } = require('express');
const { register, login, me } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const authRouter = Router();

authRouter.post('/signup', register);
authRouter.post('/signin', login);
authRouter.get('/me', authMiddleware, me);

module.exports = authRouter;