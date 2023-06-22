"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockMovement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockMovement.belongsTo(models.Products, {
        foreignKey: {
          name: "id_product",
        },
      });
      StockMovement.belongsTo(models.Warehouse, {
        foreignKey: {
          name: "warehouse_sender_id",
        },
        as: "senderWarehouse",
      });
      StockMovement.belongsTo(models.Warehouse, {
        foreignKey: {
          name: "warehouse_receive_id",
        },
        as: "receiverWarehouse",
      });
    }
  }
  StockMovement.init(
    {
      request_number: {
        type: DataTypes.INTEGER, // Tipe datanya blm
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "approved", "rejected"],
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StockMovement",
      paranoid: true,
    }
  );
  return StockMovement;
};
