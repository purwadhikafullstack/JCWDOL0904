const router = require("express").Router();
const { warehouseController } = require("../controllers");

router.post("/", warehouseController.createWarehouse)
router.get("/", warehouseController.getAllWarehouses)
router.get("/data", warehouseController.getAllWarehouses);
router.post("/update", warehouseController.editeWareHouse);
router.delete("/delete/:id", warehouseController.deleteWareHouse);

module.exports = router;
