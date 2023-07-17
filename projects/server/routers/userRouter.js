const router = require("express").Router();
const { userController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

router.post("/register", userController.userRegister);
router.post("/register-admin", tokenVerify, userController.addAdmin);
router.post("/data", userController.getUserData);
router.get("/auth", tokenVerify, userController.getUserById);
router.post("/reset-password", userController.userRequest);
router.get("/data/all", userController.getAllUserData);
router.delete("/data/delete", tokenVerify, userController.deleteUser);
router.post("/data/update", tokenVerify, userController.updateUserData);
router.post("/update-username", tokenVerify, userController.changeUsername);

module.exports = router;
