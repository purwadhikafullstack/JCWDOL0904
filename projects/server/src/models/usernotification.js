'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserNotification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            UserNotification.belongsTo(models.User, {
                foreignKey: {
                    name: "id_user",
                },
            });
            UserNotification.belongsTo(models.Notification, {
                foreignKey: {
                    name: "id_notification",
                },
            });
        }
    }
    UserNotification.init({
        read: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'UserNotification',
    });
    return UserNotification;
};