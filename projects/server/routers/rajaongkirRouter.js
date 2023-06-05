const router = require("express").Router()
const { rajaongkirController } = require("../controllers")

router.get("/province", rajaongkirController.getProvince)
router.get("/city", rajaongkirController.getCities)
router.post("/ongkir", rajaongkirController.postOngkir)

module.exports = router