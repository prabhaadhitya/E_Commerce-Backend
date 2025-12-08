const redis = require('../config/redis');

const getCache = async (key) => {
    try {
        const value = await redis.get(key);
        if (!value) return null;
        return JSON.parse(value);
    } catch (error) {
        console.log('Redis GET Error:', error);
        return null;
    }
};

const set = async (key, value, ttl = 3600) => {
    try {
        const data = JSON.stringify(value);
        if (ttl > 0) {
            await redis.set(key, data, 'EX', ttl);
        } else {
            await redis.set(key, data);
        }        
    } catch (error) {
        console.log('Redis SET Error:', error);
    }
};

const del = async (key) => {
    try {
        await redis.del(key);
    } catch (error) {
        console.log('Redis DEL Error:', error);
    }
};

const incr = async (key, expireSeconds) => {
    try {
        const newValue = await redis.incr(key);
        if (newValue === 1 && expireSeconds) {
            await redis.expire(key, expireSeconds);
        }
        return newValue;
    } catch (error) {
        console.log('Redis INCR Error:', error);
        return null;    
    }
};

module.exports = { getCache, set, del, incr };