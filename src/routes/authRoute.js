const { Router } = require('express');
const { register, login, me } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const rateLimit = require('../middlewares/rateLimitMiddleware');

const authRouter = Router();

authRouter.post('/register', rateLimit('register', 5, 3600), register);
authRouter.post('/login', rateLimit('login', 500, 60000), login);
authRouter.get('/me', authMiddleware, me);

module.exports = authRouter;