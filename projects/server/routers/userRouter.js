const router = require("express").Router();
const { userController } = require("../controllers");

router.post("/register", userController.userRegister);
router.post("/reset-password", userController.userRequest);

module.exports = router;
