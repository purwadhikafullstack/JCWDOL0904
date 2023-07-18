const router = require("express").Router()
const { cartController } = require("../controllers")
const { tokenVerify } = require("../middleware/verifyToken");

router.put("/item", cartController.removeCartItem)
router.delete("/:cartItemId", cartController.deleteCart)
router.post("/", tokenVerify, cartController.addToCart)
router.patch("/", cartController.updateCartQty)
router.get("/", tokenVerify, cartController.getCartItemByUser)

module.exports = router