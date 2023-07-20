const router = require("express").Router();
const { migrationController } = require("../controllers");

router.patch("/warehouse-stock", migrationController.migrationStock);
router.post("/add", migrationController.createMigration);

module.exports = router;
