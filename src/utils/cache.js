const { client } = require('../config/redis');

const getCache = async (key) => {
    try {
        const value = await client.get(key);
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
            await client.setEx(key, ttl, data);
        } else {
            await client.set(key, data);
        }        
    } catch (error) {
        console.log('Redis SET Error:', error);
    }
};

const del = async (key) => {
    try {
        await client.del(key);
    } catch (error) {
        console.log('Redis DEL Error:', error);
    }
};

const delByPattern = async (pattern) => {
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.log('Redis DEL pattern Error:', error);
  }
};


const incr = async (key, expireSeconds) => {
    try {
        const newValue = await client.incr(key);
        if (newValue === 1 && expireSeconds) {
            await client.expire(key, expireSeconds);
        }
        return newValue;
    } catch (error) {
        console.log('Redis INCR Error:', error);
        return null;    
    }
};

module.exports = { getCache, set, del, delByPattern, incr };