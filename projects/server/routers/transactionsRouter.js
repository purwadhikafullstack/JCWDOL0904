const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const { reportController } = require("../controllers");

// router.get("/data", transactionController.getAllTransaction);
router.get("/product", transactionController.getAllProductTrans);

module.exports = router;
