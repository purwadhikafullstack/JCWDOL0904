const db = require("../models");
const { Carts, Products, User, Category, Stocks, Warehouse } = db;

module.exports = {
  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;

      // Cek produk ada atau tidak
      const cartItem = await Carts.findOne({
        where: { id_user: userId, id_product: productId },
      });

      if (cartItem) {
        // Mengambil informasi stok total dari produk
        const product = await Products.findByPk(productId);
        const totalStock = await Stocks.sum("stock", {
          where: { id_product: productId },
        });

        if (!product || totalStock === null) {
          return res.status(404).send({ message: "Product not found" });
        }

        // Menghitung total kuantitas dalam keranjang setelah penambahan
        const totalQuantity = cartItem.quantity + quantity;

        if (totalQuantity > totalStock) {
          return res.status(200).send({ message: "Insufficient stock" });
        }
        cartItem.quantity = totalQuantity;

        await cartItem.save();
      } else {
        await Carts.create({
          id_user: userId,
          id_product: productId,
          quantity,
        });
      }

      return res
        .status(200)
        .send({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to add product to cart" });
    }
  },

  updateCartProduct: async (req, res) => {
    try {
      const { cartItemId, action, quantity } = req.body;

      const cartItem = await Carts.findByPk(cartItemId);

      if (cartItem) {
        // Get the product and total stock information
        const product = await Products.findByPk(cartItem.id_product);
        const totalStock = await Stocks.sum('stock', {
          include: [{
            model: Warehouse,
            attributes: []
          }],
          where: { id_product: cartItem.id_product }
        });

        if (!product || !totalStock) {
          return res.status(404).send({ message: "Product not found" });
        }

        if (action === "increase") {
          // Increase the quantity by 1
          const newQuantity = cartItem.quantity + 1;
          if (newQuantity > totalStock) {
            return res.status(400).send({ message: "Insufficient stock" });
          }
          cartItem.quantity = newQuantity;
        } else if (action === "decrease") {
          // Decrease the quantity by 1
          if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
          }
        } else if (action === "input") {
          // Update the quantity with the input value
          if (quantity > totalStock) {
            return res.status(400).send({ message: "Insufficient stock" });
          }
          cartItem.quantity = quantity;
        }

        const cartItems = await Carts.findOne({
          where: { id: cartItemId },
          include: [{ model: Products }],
        });

        const subtotal = cartItems.Product.price * cartItems.quantity;

        await cartItem.save();
        return res.status(200).send({
          message: "Cart item updated successfully",
          cartItems,
          subtotal,
        });
      }

      return res.status(404).send({ message: "Cart item not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to update cart item" });
    }
  },
  getAllCartItems: async (req, res) => {
    try {
      const userId = req.query.userId;

      const cartItems = await Carts.findAndCountAll({
        where: {
          id_user: userId
        },
        include: [
          {
            model: Products,
            include: [
              {
                model: Category
              },
              {
                model: Stocks
              }
            ]
          },
          { model: User },
        ],
      });

      return res.status(200).send({ cartItems: cartItems.rows });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Unable to fetch cart items' });
    }
  },
  deleteCart: async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const cartItem = await Carts.findByPk(cartItemId);
      console.log(cartItem);
      if (cartItem) {
        await Carts.destroy({ where: { id: cartItemId } });
        return res.status(200).send({ message: "Cart item deleted successfully" });
      }

      return res.status(404).send({ message: "Cart item not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to delete cart item" });
    }
  },
};
