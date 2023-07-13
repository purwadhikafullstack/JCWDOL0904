const router = require("express").Router()
const { cartController } = require("../controllers")

router.delete("/:cartItemId", cartController.deleteCart)
router.post("/", cartController.addToCart)
router.patch("/", cartController.updateCartQty)
router.get("/", cartController.getAllCartItems)

module.exports = router