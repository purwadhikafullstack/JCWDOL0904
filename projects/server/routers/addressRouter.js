const router = require("express").Router()
const { addressController } = require("../controllers")

router.post("/", addressController.createAddress)

module.exports = router