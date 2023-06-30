const router = require("express").Router();
const { warehouseController } = require("../controllers");

router.post("/", warehouseController.createWarehouse);
router.post("/", warehouseController.createWarehouse);
router.get("/data", warehouseController.getAllWarehouses);
router.post("/update", warehouseController.editeWareHouse);
router.delete("/delete/:id", warehouseController.deleteWareHouse);
router.get("/data/user", warehouseController.getAllWarehousesId);

module.exports = router;
