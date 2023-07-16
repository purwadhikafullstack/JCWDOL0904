const router = require("express").Router();
const { addressController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

router.post("/", tokenVerify, addressController.createAddress);
router.get("/", tokenVerify, addressController.getAddressByUser);
router.delete("/:id", addressController.deleteAddress);
router.patch("/:id", addressController.changeDefaultAddress);

module.exports = router;
