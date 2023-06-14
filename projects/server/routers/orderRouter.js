const router = require("express").Router()
const { orderController } = require("../controllers")
const upload = require("../middleware/multer")

router.post("/", orderController.createOrder)
router.get("/", orderController.getAllOrders)
router.patch("/upload-payment-proof/:id", upload.single("file"), orderController.uploadPaymentProof)
router.patch("/cancel/:id", orderController.cancelOrder)
router.post("/cancel-pending", orderController.cancelPendingOrders);

module.exports = router