'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Notification.belongsTo(models.User, {
                foreignKey: {
                    name: "id_user",
                },
            });
            Notification.hasMany(models.UserNotification, {
                foreignKey: {
                    name: "id_notification",
                },
            });
        }
    }
    Notification.init({
        title: DataTypes.STRING,
        message: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};