const router = require("express").Router();
const {
  warehouseController,
  initialProductWarehouseControler,
} = require("../controllers");

router.post("/", warehouseController.createWarehouse);
router.post("/", warehouseController.createWarehouse);
router.get("/data", warehouseController.getAllWarehouses);
router.post("/update", warehouseController.editeWareHouse);
router.delete("/delete/:id", warehouseController.deleteWareHouse);
router.post("/update/admin", warehouseController.changeWarehouse);
router.post(
  "/initial-stock",
  initialProductWarehouseControler.setInitialProductWarehouse
);

module.exports = router;
