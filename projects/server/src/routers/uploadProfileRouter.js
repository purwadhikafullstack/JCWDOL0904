const router = require("express").Router();
const { uploadProfileController } = require("../controllers");
const upload = require("../middleware/multer");
const { tokenVerify } = require("../middleware/verifyToken");

router.post(
  "/",
  upload.single("user_image"),
  tokenVerify,
  uploadProfileController.uploadProfilePict
);

module.exports = router;
