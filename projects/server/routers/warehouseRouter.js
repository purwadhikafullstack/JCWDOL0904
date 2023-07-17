const router = require("express").Router();
const {
  warehouseController,
  initialProductWarehouseControler,
} = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

router.post("/", warehouseController.createWarehouse);
router.post("/", warehouseController.createWarehouse);
router.get("/data", warehouseController.getAllWarehouses);
router.post("/update", warehouseController.editeWareHouse);
router.delete("/delete/:id", warehouseController.deleteWareHouse);
router.post("/update/admin", tokenVerify, warehouseController.changeWarehouse);
router.post(
  "/initial-stock",
  initialProductWarehouseControler.setInitialProductWarehouse
);

module.exports = router;
