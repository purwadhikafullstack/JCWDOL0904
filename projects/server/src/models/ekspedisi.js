'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ekspedisi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ekspedisi.hasMany(models.Transaction, {
        foreignKey: {
          name: "id_ekspedisi",
        },
      });
    }
  }
  Ekspedisi.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ekspedisi',
  });
  return Ekspedisi;
};