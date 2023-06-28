const router = require("express").Router();
const { uploadProfileController } = require("../controllers");
const upload = require("../middleware/multer");

router.post(
  "/",
  upload.single("user_image"),
  uploadProfileController.uploadProfilePict
);

module.exports = router;
