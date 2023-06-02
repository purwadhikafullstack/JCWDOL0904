'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products.hasMany(models.Carts, {
        foreignKey: {
          name: "id_product",
        },
      });
      Products.belongsTo(models.Category, {
        foreignKey: {
          name: "id_category",
        },
      });
      Products.hasMany(models.StockHistory, {
        foreignKey: {
          name: "id_product",
        },
      });
      Products.hasMany(models.StockMovement, {
        foreignKey: {
          name: "id_product",
        },
      });
      Products.hasMany(models.Stocks, {
        foreignKey: {
          name: "id_product",
        },
      });
      Products.hasMany(models.TransactionItem, {
        foreignKey: {
          name: "id_product",
        },
      });
    }
  }
  Products.init({
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};