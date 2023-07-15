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

            //read
            const whereCondition = {
                id_user: userId,
                from: 'admin',
            };
            const notif = await Notification.findAll({
                include: [
                    {
                        model: UserNotification,
                    },
                ],
                where: whereCondition,
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: parseInt(page) * parseInt(limit),
            });
            const read = await Notification.findAll({
                where: whereCondition,
                include: [
                    {
                        model: UserNotification,
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
            io.emit("notification", notif);
            io.emit("notificationRead", read);
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


            const read = await Notification.findAll({
                where: { from: 'user' },
                include: [
                    {
                        model: UserNotification,
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            io.emit("notificationAdminRead", read);
            res.status(200).send({ message: `Read Notification Success` });
        } catch (error) {
            console.error(error);
        }
    },
}