"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Address, {
        foreignKey: {
          name: "id_address",
        },
      });
      Transaction.belongsTo(models.User, {
        foreignKey: {
          name: "id_user",
        },
      });
      Transaction.belongsTo(models.Ekspedisi, {
        foreignKey: {
          name: "id_ekspedisi",
        },
      });
      Transaction.hasMany(models.TransactionItem, {
        foreignKey: {
          name: "id_transaction",
        },
      });
      Transaction.belongsTo(models.Warehouse, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
    }
  }
  Transaction.init(
    {
      total_price: {
        type: DataTypes.INTEGER,
      },
      transaction_date: {
        type: DataTypes.DATE,
      },
      courier: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM(
          "Waiting For Payment",
          "Waiting For Payment Confirmation",
          "On Proses",
          "Shipped",
          "Order Confirmed",
          "rejected"
        ),
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
