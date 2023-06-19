const router = require("express").Router()
const { warehouseController } = require("../controllers")

router.post("/", warehouseController.createWarehouse)
router.get("/", warehouseController.getAllWarehouses)


module.exports = router