const router = require("express").Router();
const { userController } = require("../controllers");

router.post("/register", userController.userRegister);
router.post("/data", userController.getUserData);
router.get("/auth/:id", userController.getUserById);
router.post("/reset-password", userController.userRequest);
router.get("/data/all", userController.getAllUserData);
router.delete("/data/delete/:id", userController.deleteUser);
router.post("/data/update", userController.updateUserData);

module.exports = router;
