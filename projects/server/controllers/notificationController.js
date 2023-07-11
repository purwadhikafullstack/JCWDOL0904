const { UserNotification, Notification, User } = require('../models');
const { sendEmailNotification, sendWebSocketNotification } = require('../utils/notificationService');
const { io } = require("../src/index")

module.exports = {
    createNotification: async (title, message, userId, from) => {
        const notification = await Notification.create({
            title,
            message,
            id_user: userId,
            from: from
        });

        await UserNotification.create({
            read: false,
            id_notification: notification.id,
            id_user: userId,
        });
        const whereCondition = {
            id_user: userId,
            from: 'admin',
        };
        // Kirim notifikasi melalui Socket.IO
        const updatedNotifications = await Notification.findAll({
            where: whereCondition,
            include: [
                {
                    model: UserNotification,
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        const whereAdminCondition = {
            from: 'user',
        };
        const updatedAdminNotifications = await Notification.findAll({
            where: whereAdminCondition,
            include: [
                {
                    model: UserNotification,
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        io.emit("notificationUpdate", updatedNotifications);
        io.emit("notificationAdminUpdate", updatedAdminNotifications);

        return notification;
    },
    getNotificationByUser: async (req, res) => {
        try {
            const { userId, showAll } = req.query;
            let notif;

            const whereCondition = {
                id_user: userId,
                from: 'admin',
            };

            if (showAll == 'true') {
                notif = await Notification.findAll({
                    where: whereCondition,
                    include: [
                        {
                            model: UserNotification,
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
            } else {
                notif = await Notification.findAll({
                    where: whereCondition,
                    include: [
                        {
                            model: UserNotification,
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                    limit: 9,
                });
            }

            const read = await Notification.findAll({
                where: whereCondition,
                include: [
                    {
                        model: UserNotification,
                    },
                ],
                order: [['createdAt', 'DESC']],
            });



            io.emit("notificationUpdate", read);


            res.status(200).send({ notif });
        } catch (error) {
            console.error(error);
        }
    },
    getAllNotificationByAdmin: async (req, res) => {
        try {
            const { showAll } = req.query;
            let notif;

            const whereCondition = {
                from: 'user',
            };

            if (showAll == 'true') {
                notif = await Notification.findAll({
                    where: whereCondition,
                    include: [
                        {
                            model: UserNotification,
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
            } else {
                notif = await Notification.findAll({
                    where: whereCondition,
                    include: [
                        {
                            model: UserNotification,
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                    limit: 9,
                });
            }

            const read = await Notification.findAll({
                where: whereCondition,
                include: [
                    {
                        model: UserNotification,
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            io.emit("notificationAdminUpdate", read);

            res.status(200).send({ notif });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Unable to fetch notifications' });
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
            });

            res.status(200).send({ notify });
        } catch (error) {
            console.error(error);
        }
    },
    readUserNotification: async (req, res) => {
        try {
            const { userId, notificationId } = req.body;

            // Check if the user has already read the notification
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
            const { userId, notificationId } = req.body;

            // Check if the user has already read the notification
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
                        id_user: userId,
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