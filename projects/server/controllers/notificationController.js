const { UserNotification, Notification } = require('../models');

module.exports = {
    getNotificationByUser: async (req, res) => {
        try {
            const { id } = req.params;
            const notif = await Notification.findAll({
                where: { id_user: id },
                include: [
                    {
                        model: UserNotification,
                    },

                ],
                order: [['createdAt', 'DESC']],
            });
            res.status(200).send({ notif });
        } catch (error) {
            console.error(error);
        }
    },
    getNotificationById: async (req, res) => {
        try {
            const { id } = req.params;
            const notify = await Notification.findAll({
                where: { id },
                include: [
                    {
                        model: UserNotification,
                    },

                ],
                order: [['createdAt', 'DESC']],
            });
            res.status(200).send({ notify });
        } catch (error) {
            console.error(error);
        }
    },
    createUserNotification: async (req, res) => {
        try {
            const { userId, notificationId } = req.body;

            // Check if the user has already read the notification
            const existingUserNotification = await UserNotification.findOne({
                where: {
                    id_user: userId,
                    id_notification: notificationId,
                },
            });

            if (existingUserNotification) {
                res.status(400).send({ message: 'Notification already read by the user' });
                return;
            }

            await UserNotification.create({
                read: true,
                id_notification: notificationId,
                id_user: userId,
            });
            res.status(200).send({ mesage: `Read Notification Success` });
        } catch (error) {
            console.error(error);
        }
    },
}