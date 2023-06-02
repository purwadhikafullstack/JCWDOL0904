'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Carts.belongsTo(models.Products, {
        foreignKey: {
          name: "id_product",
        },
      });
      Carts.belongsTo(models.User, {
        foreignKey: {
          name: "id_user",
        },
      });
    }
  }
  Carts.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Carts',
  });
  return Carts;
};