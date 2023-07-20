const router = require("express").Router();
const {
  notificationController,
  notificationReadController,
} = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

router.get("/", tokenVerify, notificationController.getNotificationByUser);
router.get("/admin", notificationController.getAllNotificationByAdmin);
router.get("/:id/detail", notificationController.getNotificationById);
router.post("/", notificationReadController.readUserNotification);
router.post("/admin", notificationReadController.readAdminNotification);

module.exports = router;
