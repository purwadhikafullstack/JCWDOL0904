const router = require("express").Router();
const {
  orderControllers,
  orderPaymentController,
  orderGetController,
  orderAdminController,
  orderCancelController,
} = require("../controllers");
const upload = require("../middleware/multer").single("file");
const { tokenVerify } = require("../middleware/verifyToken");

router.get("/", orderGetController.getAllOrders);
router.get("/user", tokenVerify, orderGetController.getAllOrderByUser);

router.post("/", tokenVerify, orderControllers.createOrder);
router.get("/:warehouseId", orderGetController.getOrdersByWarehouse);
router.patch("/:id/cancel", orderControllers.cancelOrder);
router.put("/:id/accept", orderControllers.acceptOrder);

// Admin
router.get("/detail/:id", orderGetController.getOrderById);
router.patch("/:id/reject", orderAdminController.rejectOrder);
router.patch("/confirm", orderAdminController.confirmOrder);
router.post("/send/:orderId", orderAdminController.sendOrder);

router.patch(
  "/upload-payment-proof/:id",
  upload,
  orderPaymentController.uploadPaymentProof
);
router.get("/:id/payment-proof", orderPaymentController.getPaymentProof);

router.post("/order-cancel", orderCancelController.cancelOrder);

module.exports = router;
