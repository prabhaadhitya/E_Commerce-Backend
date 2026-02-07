const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

    // database: process.env.DB_NAME,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,    
    // host: process.env.DB_HOST,

const sequelize = new Sequelize(process.env.NEONDB_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
})

const connectSequelize = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully');
        await sequelize.sync()
    } catch (error) {
        console.log('PostgreSQL connection failed:', error);
        process.exit(1);
    }
}

module.exports = { sequelize, connectSequelize };