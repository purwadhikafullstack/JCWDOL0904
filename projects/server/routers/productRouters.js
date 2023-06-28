const router = require("express").Router();
const { productControllers } = require("../controllers");
const upload = require("../middleware/multer").single("file");

router.get("/all", productControllers.getAllProduct);
router.post("/detail", productControllers.getOneProduct);
router.post("/image-upload", upload, productControllers.updateImageProduct);
router.patch("/update-data", productControllers.updateProductData);
router.delete("/delete/:id", productControllers.deleteProduct);
router.post("/add", upload, productControllers.createNewProduct);
router.post("/stock-init", productControllers.addInitialStock);

module.exports = router;
