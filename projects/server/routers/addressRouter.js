const router = require("express").Router()
const { addressController } = require("../controllers")

router.post("/", addressController.createAddress)
router.get('/:userId', addressController.getAllAddresses);

module.exports = router