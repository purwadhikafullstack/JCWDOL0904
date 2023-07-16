const router = require("express").Router();
const { addressController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

router.post("/create-address", tokenVerify, addressController.createAddress);
router.get("/all-address", tokenVerify, addressController.getAllAddresses);
router.delete("/delete-address/:id", addressController.deleteAddress);
router.patch("/change-address/:id", addressController.changeDefaultAddress);

module.exports = router;
