const router = require("express").Router();
const { promotionControllers } = require("../controllers");

router.get("/", promotionControllers.getAllPromotion);

module.exports = router;
