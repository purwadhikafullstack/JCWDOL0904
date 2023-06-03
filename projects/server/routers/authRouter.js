const router = require("express").Router();
const { authController } = require("../controllers");

const validator = require("../middleware/validator");

router.post("/login", authController.userLogin);
router.post("/verification", authController.userVerification);
// router.get("/dummy-authorization", validator.authorize, authController.userVerification);

module.exports = router;
