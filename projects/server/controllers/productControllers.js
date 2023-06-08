const db = require("../models");
const product = db.Products;
const stocks = db.Stocks;

module.exports = {
  getAllProduct: async (req,res) => {
    let page = parseInt(req.query.page)
    const search = req.query.search || ""
    const order = req.query.order 
    const sort = req.query.sort
    const category = req.query.category || 1
    const limit = 9
    const where = {
      product_name : {
        [db.Sequelize.Op.like] : `%${search}%`
      },
      id_category : category
    }

    const SORT =  [[order,sort]]
    console.log(SORT)

    if (search) page = 0
    
    let result
    const { count: allCount, rows: allSort } = await product.findAndCountAll({
      where,
    })

      const totalPage = Math.ceil(allCount / limit)

      if (page > totalPage - 1) {
        page = 0
      }

      const {count: updatedCount , rows: updatedRows} = await product.findAndCountAll({
        where,
        order: SORT,
        limit:limit,
        offset: (page) * limit
      })

      console.log(page)
      result = { data : updatedRows, totalProduct : updatedCount, totalPage}
res.send({ message: "success", ...result})

  },


  getOneProduct: async (req, res) => {
    try {

      const { idP } = req.body;

      const productById = await product.findOne({
        where: {
          id: idP
        },
        include: [stocks]
      })

      const stock = productById.Stocks.reduce((acc, curr) => {
        return acc + curr.stock
      }, 0)

      res.status(200).send({
        message: "success",
        productById,
        stock
      })



    } catch (error) {
      res.status(400).send(error)
    }
  }
};
