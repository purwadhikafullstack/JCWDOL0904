const router = require("express").Router();
const { tokenValidatorController } = require("../controllers");

router.get("/tokencheck", tokenValidatorController.tokenValid);

module.exports = router;
