'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warehouse.hasMany(models.StockMovement, {
        foreignKey: {
          name: "warehouse_sender_id",
        },
      });
      Warehouse.hasMany(models.StockMovement, {
        foreignKey: {
          name: "warehouse_receive_id",
        },
      });
      Warehouse.hasMany(models.Stocks, {
        foreignKey: {
          name: "id_warehouse",
        },
      });
    }
  }
  Warehouse.init({
    warehouse: {
      type: DataTypes.STRING,
      allowNull: false
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subdistrict: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Warehouse',
  });
  return Warehouse;
};