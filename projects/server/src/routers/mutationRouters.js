const {
  mutationControllers,
  mutationAutomaticController,
} = require("../controllers");
const router = require("express").Router();
const { tokenVerify } = require("../middleware/verifyToken");

router.patch("/rejected", tokenVerify, mutationControllers.rejectMutation);
router.patch("/proceed", tokenVerify, mutationControllers.proceedMutation);
router.post(
  "/manual-mutation",
  tokenVerify,
  mutationControllers.manualMutation
);
router.post("/auto-mutation", mutationAutomaticController.autoMutation);
router.get("/data-mutation", tokenVerify, mutationControllers.getAllMutation);

module.exports = router;
