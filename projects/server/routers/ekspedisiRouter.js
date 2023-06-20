const router = require("express").Router()
const ekspedisiController = require("../controllers/ekspedisiController")

router.get("/", ekspedisiController.getAllEkspedisi)

module.exports = router