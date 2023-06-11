const router = require("express").Router()
const { cartController } = require("../controllers")

router.delete("/:cartItemId", cartController.deleteCart)
router.post("/add", cartController.addToCart)
router.patch("/update", cartController.updateCartProduct)
router.get("/", cartController.getAllCartItems)

module.exports = router