const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const CartItem = sequelize.define('CartItem', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    cartId: {type: DataTypes.INTEGER, allowNull: false},
    productId: {type: DataTypes.INTEGER, allowNull: false},
    qty: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    priceSnapshotCents: {type: DataTypes.INTEGER, allowNull: false},
}, {
    tableName: 'cart_items',
});

module.exports = CartItem;