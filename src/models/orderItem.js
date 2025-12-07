const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const OrderItem = sequelize.define('OrderItem', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    orderId: {type: DataTypes.INTEGER, allowNull: false},
    productId: {type: DataTypes.INTEGER, allowNull: false},
    qty: {type: DataTypes.INTEGER, allowNull: false},
    priceCents: {type: DataTypes.INTEGER, allowNull: false},   
}, {
    tableName: 'order_items',
});

module.exports = OrderItem;