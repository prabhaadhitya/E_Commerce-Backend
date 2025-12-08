const { Router } = require('express');
const { register, login, me } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const rateLimit = require('../middlewares/rateLimitMiddleware');

const authRouter = Router();

authRouter.post('/signup', rateLimit('signup', 5, 3600), register);
authRouter.post('/signin', rateLimit('signin', 5, 600), login);
authRouter.get('/me', authMiddleware, me);

module.exports = authRouter;