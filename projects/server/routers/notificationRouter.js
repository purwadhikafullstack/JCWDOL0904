const router = require("express").Router()
const { notificationController } = require("../controllers")

router.get("/", notificationController.getNotificationByUser)
router.get("/admin", notificationController.getAllNotificationByAdmin)
router.get("/:id/detail", notificationController.getNotificationById)
router.post("/", notificationController.readUserNotification)
router.post("/admin", notificationController.readAdminNotification)

module.exports = router