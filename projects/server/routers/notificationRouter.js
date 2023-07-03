const router = require("express").Router()
const { notificationController } = require("../controllers")

router.get("/:id", notificationController.getNotificationByUser)
router.get("/:id/detail", notificationController.getNotificationById)
router.post("/", notificationController.createUserNotification)

module.exports = router