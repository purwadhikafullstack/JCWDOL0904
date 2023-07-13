const router = require("express").Router()
const { notificationController, notificationReadController } = require("../controllers")

router.get("/", notificationController.getNotificationByUser)
router.get("/admin", notificationController.getAllNotificationByAdmin)
router.get("/:id/detail", notificationController.getNotificationById)
router.post("/", notificationReadController.readUserNotification)
router.post("/admin", notificationReadController.readAdminNotification)

module.exports = router