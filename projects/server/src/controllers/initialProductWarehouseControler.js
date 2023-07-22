const db = require("..//models");
const product = db.Products;
const stoc = db.Stocks;

module.exports = {
  setInitialProductWarehouse: async (req, res) => {
    try {
      const { id_warehouse } = req.body;
      const cekStock = await stoc.findAll({
        id_warehouse,
      });
      if (cekStock && cekStock.length > 0)
        res.status(200).send({ message: "stock already added" });

      const getProducts = await product.findAll();

      await Promise.all(
        getProducts.forEach(async (el) => {
          const initialStock = await stoc.create({
            stock: 0,
            id_warehouse,
            id_product: el.id,
          });
        })
      );
      res.status(200).send({
        getProducts,
        id_warehouse,
      });
    } catch (error) {
      res.status(400).send({
        message: "failed initial stock!",
      });
    }
  },
};
