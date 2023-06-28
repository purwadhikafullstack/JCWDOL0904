const router = require("express").Router();
const { addressController } = require("../controllers");

router.post("/", addressController.createAddress);
router.get("/:userId", addressController.getAllAddresses);
router.delete("/:id", addressController.deleteAddress);
router.patch("/:id", addressController.changeDefaultAddress);

module.exports = router;
