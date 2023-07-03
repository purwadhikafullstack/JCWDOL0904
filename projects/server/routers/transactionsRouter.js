const router = require("express").Router();
const transactionController = require("../controllers/transactionController");

router.get("/data", transactionController.getAllTransaction);

module.exports = router;
