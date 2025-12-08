const { incr } = require('../utils/cache');

const rateLimit = (prefix, limit = 5, windowSeconds = 600) => {
    return async (req, res, next) => {
        try {
            const clientIp = req.ip || "unknown";
            const key = `ratelimit:${prefix}:${clientIp}`;
            const count = await incr(key, windowSeconds);
            if (count === null) {
                return next();
            }
            if (count > limit) {
                return res.status(429).json({ message: 'Too many requests. Please try again later.' });
            }
            res.locals.rateLimitCount = { count, limit, windowSeconds };
            next();
        } catch (error) {
            console.log('Rate Limiter Middleware Error:', error);
            next();
        }
    }
};

module.exports = rateLimit;