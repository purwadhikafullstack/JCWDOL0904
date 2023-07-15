"use strict";
const { Model } = require("sequelize");
const shortId = require("shortid");
module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockHistory.belongsTo(models.Products, {
        foreignKey: {
          name: "id_product",
        },
      });
      StockHistory.belongsTo(models.Warehouse, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
    }
  }
  StockHistory.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("in", "out"),
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING,
        defaultValue: () => shortId.generate(),
      },
      current_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StockHistory",
    }
  );
  return StockHistory;
};
