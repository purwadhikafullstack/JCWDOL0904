const router = require("express").Router();
const { stockControllers } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

router.get("/all", tokenVerify, stockControllers.geAllProductStock);
router.patch("/update", tokenVerify, stockControllers.updateStock);
router.patch("/decrease", tokenVerify, stockControllers.decreaseStock);
router.post("/initial", stockControllers.initialDataStock);

module.exports = router;
