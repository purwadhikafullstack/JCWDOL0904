const router = require("express").Router();
const { authController } = require("../controllers");

router.post("/login", authController.userLogin);
router.post("/verification", authController.userVerification);
router.post("/resetpassword", authController.requestReset);
router.post("/updatepassword", authController.updatePassword);

module.exports = router;
