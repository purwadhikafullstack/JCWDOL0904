const { dashboardController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");
const router = require("express").Router();

router.get(
  "/transaction-count",
  tokenVerify,
  dashboardController.countAllTransaction
);
router.get(
  "/mutation-count",
  tokenVerify,
  dashboardController.countAllMutation
);
router.post("/user-count", tokenVerify, dashboardController.countAllUserBuy);

module.exports = router;
