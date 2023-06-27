'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
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
      Transaction.belongsTo(models.Warehouse, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
      Transaction.hasMany(models.TransactionItem, {
        foreignKey: {
          name: "id_transaction",
          onDelete: 'CASCADE',
        },
      });
    }
  }
  Transaction.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total_price: {
      type: DataTypes.INTEGER,
    },
    invoice_number: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    payment_proof: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_date: {
      type: DataTypes.DATE,
    },
    expired: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('Waiting For Payment', 'Waiting For Payment Confirmation', 'On Proses', 'Shipped', 'Order Confirmed', 'rejected', 'Canceled'),
    },
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  Transaction.beforeCreate((transaction) => {
    transaction.invoice_number = uuidv4(); // Generate UUID and assign it to the 'invoice_number' field
  });

  return Transaction;
};