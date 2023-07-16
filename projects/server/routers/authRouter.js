const router = require("express").Router();
const { authController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

router.post("/login", authController.userLogin);
router.post("/verification", authController.userVerification);
router.post("/resetpassword", authController.requestReset);
router.post("/updatepassword", tokenVerify, authController.updatePassword);

module.exports = router;
