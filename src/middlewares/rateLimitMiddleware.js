const { client } = require('../config/redis');

const rateLimit = async (req, res, next) => {
    try {
        const key = "rate_limit_counter";
        const count = await client.incr(key);
        if (count === 1) {
            await client.expire(key, 60);
        }

        if (count > 5) {
            return res.status(429).json({
                message: "Too many requests"
            });
        }
        next();
    } catch (err) {
        console.log("Rate limit error: ", err);
        next();
    }
}

module.exports = rateLimit;