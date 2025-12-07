const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Order = sequelize.define('Order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.UUID, allowNull: false},
    totalCents: {type: DataTypes.INTEGER, allowNull: false},
    status: {type: DataTypes.ENUM('pending', 'paid', 'cancelled'), defaultValue: 'pending'},
    shippingAddress: {type: DataTypes.JSONB, allowNull: false},
    paymentMeta: {type: DataTypes.JSONB, allowNull: true},
}, {
    tableName: 'orders',
});

module.exports = Order;