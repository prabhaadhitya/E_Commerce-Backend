const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Cart = sequelize.define('Cart', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    userId: {type: DataTypes.UUID, allowNull: false},
}, {
    tableName: 'carts',
});

module.exports = Cart;