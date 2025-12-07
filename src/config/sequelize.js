const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,    
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
})

const connectSequelize = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully.');
    } catch (error) {
        console.log('PostgreSQL connection failed:', error);
        process.exit(1);
    }
}

module.exports = { sequelize, connectSequelize };