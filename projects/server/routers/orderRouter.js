const router = require("express").Router()
const { orderController, orderPaymentController } = require("../controllers")
const upload = require("../middleware/multer")

router.post("/", orderController.createOrder)
router.get("/", orderController.getAllOrders)
router.get("/user", orderController.getAllOrderByUser);
router.get("/:warehouseId", orderController.getOrdersByWarehouse);
router.get("/detail/:id", orderController.getOrderById);
router.patch("/cancel/:id", orderController.cancelOrder)
router.patch('/:id/reject', orderController.rejectOrder);

router.patch("/upload-payment-proof/:id", upload.single("file"), orderPaymentController.uploadPaymentProof)
router.get("/:id/payment-proof", orderPaymentController.getPaymentProof)

module.exports = router