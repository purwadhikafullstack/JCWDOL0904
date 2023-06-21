const router = require("express").Router();
const { userController } = require("../controllers");

router.post("/register", userController.userRegister);
router.post("/data", userController.getUserData);
router.get("/auth/:id", userController.getUserById);

router.post("/reset-password", userController.userRequest);

module.exports = router;
