const router = require("express").Router();
const { addressController } = require("../controllers");

router.post("/", addressController.createAddress);
router.get("/:userId", addressController.getAllAddresses);
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
