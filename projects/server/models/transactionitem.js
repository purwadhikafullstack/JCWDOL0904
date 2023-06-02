'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionItem.belongsTo(models.Transaction, {
        foreignKey: {
          name: "id_transaction",
        },
      });
      TransactionItem.belongsTo(models.Products, {
        foreignKey: {
          name: "id_product",
        },
      });
    }
  }
  TransactionItem.init({
    quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'TransactionItem',
  });
  return TransactionItem;
};