const router = require("express").Router()
const { orderController } = require("../controllers")
const upload = require("../middleware/multer")

router.post("/", orderController.createOrder)
router.get("/", orderController.getAllOrders)
router.get("/:warehouseId", orderController.getOrdersByWarehouse);
router.get("/user/:id_user", orderController.getAllOrderByUser);
router.get("/detail/:id", orderController.getOrderById);
router.patch("/upload-payment-proof/:id", upload.single("file"), orderController.uploadPaymentProof)
router.patch("/cancel/:id", orderController.cancelOrder)
router.get("/:id/payment-proof", orderController.getPaymentProof)
router.patch('/:id/reject', orderController.rejectOrder);

module.exports = router