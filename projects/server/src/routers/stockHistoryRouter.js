const router = require("express").Router();
const { stockHistoryController } = require("../controllers");

router.get("/history", stockHistoryController.getStockHistory);

module.exports = router;
