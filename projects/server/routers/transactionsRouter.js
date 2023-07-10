const router = require("express").Router();
const transactionController = require("../controllers/transactionController");

// router.get("/data", transactionController.getAllTransaction);
router.get("/product", transactionController.getAllProductTrans);
router.get("/date", transactionController.getTimeTransaction);
router.get("/date-all", transactionController.getMonthlyTransaction);

module.exports = router;
