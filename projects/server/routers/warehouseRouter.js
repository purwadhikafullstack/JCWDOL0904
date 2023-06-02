const router = require("express").Router()
const { warehouseController } = require("../controllers")

router.post("/", warehouseController.createWarehouse)


module.exports = router