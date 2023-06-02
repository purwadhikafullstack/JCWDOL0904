'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FakeUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // MODEL INI BUAT LATIHAN SAJA
    }
  }
  FakeUser.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FakeUser',
  });
  return FakeUser;
};