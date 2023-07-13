const { UserNotification, Notification } = require('../models');

module.exports = {
    readUserNotification: async (req, res) => {
        try {
            const { userId, notificationId } = req.body;

            const existingUserNotification = await UserNotification.findOne({
                where: {
                    read: true,
                    id_user: userId,
                    id_notification: notificationId,
                },
                include: [
                    {
                        model: Notification,
                        where: {
                            from: 'admin',
                        },
                    },
                ],
            });

            if (existingUserNotification) {
                res.status(400).send({ message: 'Notification already read by the user' });
                return;
            }

            await UserNotification.update(
                {
                    read: true,
                },
                {
                    where: {
                        id_user: userId,
                        id_notification: notificationId,
                    },
                    include: [
                        {
                            model: Notification,
                            where: {
                                from: 'admin',
                            },
                        },
                    ],
                }
            );
            res.status(200).send({ message: `Read Notification Success` });
        } catch (error) {
            console.error(error);
        }
    },
    readAdminNotification: async (req, res) => {
        try {
            const { notificationId } = req.body;

            const existingUserNotification = await UserNotification.findOne({
                where: {
                    read: true,
                    id_notification: notificationId,
                },
                include: [
                    {
                        model: Notification,
                        where: {
                            from: 'user',
                        },
                    },
                ],
            });
            if (existingUserNotification) {
                res.status(400).send({ message: 'Notification already read by the user' });
                return;
            }

            await UserNotification.update(
                {
                    read: true,
                },
                {
                    where: {
                        id_notification: notificationId,
                    },
                    include: [
                        {
                            model: Notification,
                            where: {
                                from: 'user',
                            },
                        },
                    ],
                }
            );
            res.status(200).send({ message: `Read Notification Success` });
        } catch (error) {
            console.error(error);
        }
    },
}