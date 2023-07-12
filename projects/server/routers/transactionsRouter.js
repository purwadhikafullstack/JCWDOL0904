const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const { reportController } = require("../controllers");

// router.get("/data", transactionController.getAllTransaction);
router.get("/product", transactionController.getAllProductTrans);
router.get("/date", transactionController.getTimeTransaction);
router.get("/date-all", transactionController.getMonthlyTransaction);
router.get("/report", reportController.getAllReport);

module.exports = router;
