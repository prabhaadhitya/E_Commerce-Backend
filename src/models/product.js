const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Product = sequelize.define('Product', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT},
    priceCents: {type: DataTypes.INTEGER, allowNull: false},
    stock: {type: DataTypes.INTEGER, defaultValue: 0},
    categoryId: {type: DataTypes.INTEGER},
}, {
    tableName: 'products',
});

module.exports = Product;