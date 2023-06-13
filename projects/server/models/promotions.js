"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Promotions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Promotions.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resolusi: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      promotion_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Promotions",
    }
  );
  return Promotions;
};
