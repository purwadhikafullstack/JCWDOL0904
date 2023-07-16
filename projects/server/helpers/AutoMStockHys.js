const db = require("../models");
const stockhistory = db.StockHistory;

module.exports = {
  forUpdateStockHys: async (
    status,
    current_stock,
    quantity,
    id_product,
    id_warehouse
  ) => {
    const updateDataStc = await stockhistory.create({
      status: "out",
      current_stock: el.stock,
      quantity: el.stockMove,
      id_product: el.id_product,
      id_warehouse: el.id_warehouse,
    });
    return updateDataStc;
  },
};
