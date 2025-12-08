const Redis = require('ioredis');
require('dotenv').config();

const url = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(url);

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.log('Redis connection error:', err);
});

module.exports = redis;