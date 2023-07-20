const router = require("express").Router();
const { productControllers, FavoriteController } = require("../controllers");
const upload = require("../middleware/multer").single("file");
const { tokenVerify } = require("../middleware/verifyToken");

router.get("/all", productControllers.getAllProduct);
router.post("/detail", productControllers.getOneProduct);
router.post("/image-upload", upload, productControllers.updateImageProduct);
router.patch("/update-data", productControllers.updateProductData);
router.delete("/delete/:id", productControllers.deleteProduct);
router.post("/add", upload, productControllers.createNewProduct);
router.post("/stock-init", productControllers.addInitialStock);
router.get("/favorite", tokenVerify, FavoriteController.getMostSold);

module.exports = router;
