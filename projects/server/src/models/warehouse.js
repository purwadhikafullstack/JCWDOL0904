"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warehouse.hasMany(models.User, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
      Warehouse.hasMany(models.StockMovement, {
        foreignKey: {
          name: "warehouse_sender_id",
        },
        as: "senderWarehouse",
      });
      Warehouse.hasMany(models.StockMovement, {
        foreignKey: {
          name: "warehouse_receive_id",
        },
        as: "receiverWarehouse",
      });
      Warehouse.hasMany(models.Stocks, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
      Warehouse.hasMany(models.Transaction, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
      Warehouse.hasMany(models.User, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
      Warehouse.hasMany(models.StockHistory, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
    }
  }
  Warehouse.init(
    {
      warehouse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      warehouse_city_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subdistrict: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zip: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Warehouse",
      paranoid: true,
    }
  );
  return Warehouse;
};
