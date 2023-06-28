"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Address, {
        foreignKey: {
          name: "id_user",
        },
      });
      User.hasMany(models.Carts, {
        foreignKey: {
          name: "id_user",
        },
      });
      User.hasMany(models.Stocks, {
        foreignKey: {
          name: "id_user",
        },
      });
      User.hasMany(models.Transaction, {
        foreignKey: {
          name: "id_user",
        },
      });
    }
  }
  User.init(
    {
      fullname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      user_image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "http://localhost:8000/avatar_default.jpg",
      },
      role: {
        type: DataTypes.ENUM,
        values: ["user", "admin", "adminWarehouse"],
        defaultValue: "user",
      },
      verify_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
