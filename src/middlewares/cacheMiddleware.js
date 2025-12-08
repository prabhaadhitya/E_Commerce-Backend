const { getCache } = require('../utils/cache');

const cacheMiddleware = (ttl = 60) => {
    return async (req, res, next) => {
        try {
            let key = res.locals.cacheKey;
            if (!key) {
                if (req.params && req.params.id) {
                    key = `cache:${req.path}:${req.params.id}`;
                } else {
                    key = `cache:${req.originalUrl}`;
                }    
            }
            const cachedData = await getCache(key);
            if (cachedData) {
                return res.json({ cachedData, cached: true });
            }
            res.locals.cacheKey = key;
            res.locals.cacheTTL = ttl;
            next();
        } catch (error) {
            console.log('Cache Middleware Error:', error);
            next();
        }
    };
};

module.exports = cacheMiddleware;