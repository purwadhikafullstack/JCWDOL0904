"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stocks.belongsTo(models.Products, {
        foreignKey: {
          name: "id_product",
        },
      });
      Stocks.belongsTo(models.Warehouse, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
    }
  }
  Stocks.init(
    {
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Stocks",
      paranoid: true,
    }
  );
  return Stocks;
};
