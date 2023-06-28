const router = require("express").Router();
const { categoryControllers } = require("../controllers");

router.get("/", categoryControllers.getAllCategory);
router.post("/add", categoryControllers.addCategory);
router.delete("/delete/:id", categoryControllers.deleteCategory);
router.patch("/update", categoryControllers.editeCategory);

module.exports = router;
