const db = require('../models');
const { UserNotification, Notification } = require('../models');
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

        io.emit("notification", updatedNotifications);
        io.emit("notificationRead", updatedNotifications);
        io.emit("notificationAdmin", updatedAdminNotifications);
        io.emit("notificationAdminRead", updatedAdminNotifications);

        return notification;
    },
    getNotificationByUser: async (req, res) => {
        try {
            const { id } = req.dataToken;
            const { page, invoiceNumber } = req.query;
            const limit = 9;
            let whereCondition = {};
            if (id) {
                whereCondition.id_user = id;
                whereCondition.from = 'admin';
            }
            if (invoiceNumber) {
                whereCondition.title = {
                    [db.Sequelize.Op.like]: `%${invoiceNumber}%`,
                };
            }
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
            const count = await Notification.count({
                where: whereCondition,
            });
            const totalPages = Math.ceil(count / limit);

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
            res.status(200).send({ notif, totalPages });
        } catch (error) {
            console.error(error);
        }
    },
    getAllNotificationByAdmin: async (req, res) => {
        try {
            const { page, invoiceNumber } = req.query;
            const limit = 9;
            let whereCondition = {};
            if (page) {
                whereCondition.from = 'user';
            }
            if (invoiceNumber) {
                whereCondition.title = {
                    [db.Sequelize.Op.like]: `%${invoiceNumber}%`,
                };
            }
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
            const count = await Notification.count({
                where: whereCondition,
            });
            const totalPages = Math.ceil(count / limit);

            const read = await Notification.findAll({
                where: { from: 'user' },
                include: [
                    {
                        model: UserNotification,
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            io.emit("notificationAdmin", notif);
            io.emit("notificationAdminRead", read);
            res.status(200).send({ notif, totalPages });
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
}