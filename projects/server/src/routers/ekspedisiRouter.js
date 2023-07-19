const router = require("express").Router();
const ekspedisiController = require("../controllers/ekspedisiController");

router.get("/user", ekspedisiController.getUserEkspedisi);
router.get("/", ekspedisiController.getAllEkspedisi);
router.post("/", ekspedisiController.createEkspedisi);
router.delete("/:id", ekspedisiController.deleteEkspedisi);

module.exports = router;
