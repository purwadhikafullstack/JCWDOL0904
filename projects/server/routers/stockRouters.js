const router = require("express").Router();
const { stockControllers } = require("../controllers");

router.get("/all", stockControllers.geAllProductStock);
router.patch("/update", stockControllers.updateStock);
router.patch("/decrease", stockControllers.decreaseStock);
router.post("/initial", stockControllers.initialDataStock);

module.exports = router;
