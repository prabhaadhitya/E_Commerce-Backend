const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const ProductImage = sequelize.define('ProductImage', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    productId: {type: DataTypes.INTEGER},
    s3Key: {type: DataTypes.STRING, allowNull: false},
    isPrimary: {type: DataTypes.BOOLEAN, defaultValue: false},
}, {
    tableName: 'product_images',
});

module.exports = ProductImage;