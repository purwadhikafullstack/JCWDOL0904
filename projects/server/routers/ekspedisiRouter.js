const router = require("express").Router()
const { expedisiController } = require("../controllers")
const ekspedisiController = require("../controllers/ekspedisiController")

router.get("/", ekspedisiController.getAllEkspedisi)

module.exports = router