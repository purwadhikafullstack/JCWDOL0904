const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const { tokenVerify } = require("../middleware/verifyToken");

// router.get("/data", transactionController.getAllTransaction);
router.get("/product", transactionController.getAllProductTrans);
router.get("/user", tokenVerify, transactionController.getTransactionById);

module.exports = router;
