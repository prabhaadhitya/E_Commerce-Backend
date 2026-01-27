const { createClient } = require('redis')
require('dotenv').config();

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
    }
})

// client.on('connect', () => console.log('Connected to Redis'));
// client.on('error', err => console.log('Redis Client Error', err));
// await client.connect();

const connectRedis = async () => {
    try {
        await client.connect();
        console.log('Redis connected successfully');
    } catch (err) {
        console.log('Redis Client Error', err);
        process.exit(1);
    }
}

// const Redis = require('ioredis');
// require('dotenv').config();
// const url = process.env.REDIS_URL || 'redis://localhost:6379';
// const redis = new Redis(url);
// redis.on('connect', () => {
//     console.log('Connected to Redis');
// });
// redis.on('error', (err) => {
//     console.log('Redis connection error:', err);
// });

module.exports = { client, connectRedis };