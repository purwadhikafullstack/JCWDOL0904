"use strict";
const { Model } = require("sequelize");
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
      },
    },
    {
      sequelize,
      modelName: "StockHistory",
    }
  );
  // StockHistory.beforeCreate((transaction) => {
  //   transaction.invoice_number = uuidv4(); // Generate UUID and assign it to the 'invoice_number' field});
  // });
  return StockHistory;
};
