const router = require("express").Router()
const { orderController } = require("../controllers")
const upload = require("../middleware/multer")

router.post("/", orderController.createOrder)
router.get("/", orderController.getAllOrders)
router.get("/:warehouseId", orderController.getOrdersByWarehouse);
router.patch("/upload-payment-proof/:id", upload.single("file"), orderController.uploadPaymentProof)
router.patch("/cancel/:id", orderController.cancelOrder)

module.exports = router