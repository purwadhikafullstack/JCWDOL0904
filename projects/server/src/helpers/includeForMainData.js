const db = require("../models");
const transactionItem = db.TransactionItem;
const product = db.Products;
const stocks = db.Stocks;

module.exports = {
  getIncludeForMainData: async (id_warehouse_seller) => {
    const IncludeForMainData = [
      {
        model: transactionItem,
        include: [
          {
            model: product,
            include: [
              {
                model: stocks,
                where: {
                  id_warehouse: id_warehouse_seller,
                },
              },
            ],
          },
        ],
      },
    ];

    return IncludeForMainData;
  },
};
