const router = require("express").Router()
const { TestingMulterController } = require("../controllers")
const upload = require("../middleware/multer")

router.post("/", upload.single("file"), TestingMulterController.CreateFakeUser)

module.exports = router