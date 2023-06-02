const router = require("express").Router()
const { nearestWarehouseController } = require("../controllers")

router.get("/:addressId", nearestWarehouseController.findNearestWarehouse)

module.exports = router