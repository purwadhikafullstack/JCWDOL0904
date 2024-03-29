const { UserNotification, Notification } = require("..//models");

module.exports = {
  readUserNotification: async (req, res) => {
    try {
      const { notificationId } = req.body;
      const { id } = req.dataToken;

      const existingUserNotification = await UserNotification.findOne({
        where: {
          read: true,
          id_user: id,
          id_notification: notificationId,
        },
        include: [
          {
            model: Notification,
            where: {
              from: "admin",
            },
          },
        ],
      });

      if (existingUserNotification) {
        res
          .status(400)
          .send({ message: "Notification already read by the user" });
        return;
      }

      await UserNotification.update(
        {
          read: true,
        },
        {
          where: {
            id_user: id,
            id_notification: notificationId,
          },
          include: [
            {
              model: Notification,
              where: {
                from: "admin",
              },
            },
          ],
        }
      );

      const whereCondition = {
        id_user: id,
        from: "admin",
      };
      const notif = await Notification.findAll({
        include: [
          {
            model: UserNotification,
          },
        ],
        where: whereCondition,
        order: [["createdAt", "DESC"]],
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
        order: [["createdAt", "DESC"]],
      });
      io.emit("notification", notif);
      io.emit("notificationRead", read);
      res.status(200).send({ message: `Read Notification Success` });
    } catch (error) {
      res.status(400).send({
        message: "failed read notification!",
      });
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
              from: "user",
            },
          },
        ],
      });
      if (existingUserNotification) {
        res
          .status(400)
          .send({ message: "Notification already read by the user" });
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
                from: "user",
              },
            },
          ],
        }
      );

      const read = await Notification.findAll({
        where: { from: "user" },
        include: [
          {
            model: UserNotification,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      io.emit("notificationAdminRead", read);
      res.status(200).send({ message: `Read Notification Success` });
    } catch (error) {
      res.status(400).send({
        message: "failed read notification admin!",
      });
    }
  },
};
