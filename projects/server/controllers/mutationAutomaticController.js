const db = require("../models");
const { sequelize } = require("../models");
const product = db.Products;
const stocks = db.Stocks;
const stockmovement = db.StockMovement;
const stockhistory = db.StockHistory;
const transactionItem = db.TransactionItem;
const transaction = db.Transaction;
const warehouse = db.Warehouse;

module.exports = {
  autoMutation: async (req, res) => {
    try {
      const { id } = req.body;
      const warehouse_seller = await transaction.findOne({
        where: {
          id,
        },
        include: [warehouse],
      });
      const allWarehouse = await warehouse.findAll();
      const id_warehouse_seller = warehouse_seller.id_warehouse;
      const warehouseSellerData = warehouse_seller.Warehouse;
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
      const result = await transaction.findOne({
        where: {
          id,
        },
        include: IncludeForMainData,
      });
      const allProduct = result.TransactionItems.map((el) => {
        return {
          id: el.Product.Stocks[0].id,
          id_product: el.id_product,
          stock: el.Product.Stocks[0].stock,
          product_name: el.Product.product_name,
        };
      });
      const allItemRequestQty = result.TransactionItems.map((el) => {
        return { id_product: el.id_product, request_qty: el.quantity };
      });
      const mutationNeeded = [];
      const noMutationNeeded = [];
      await Promise.all(
        allItemRequestQty?.map((customer) => {
          const prod = allProduct.find(
            (pro) => pro.id_product === customer.id_product
          );
          if (prod && customer.request_qty > prod.stock) {
            const difference = customer.request_qty - prod.stock;
            mutationNeeded.push({
              id_product: customer.id_product,
              qty: difference,
              product_name: prod.product_name,
              qty_origin: prod.stock,
            });
          } else if (prod && customer.request_qty < prod.stock) {
            noMutationNeeded.push({
              id_product: customer.id_product,
              qty: customer.request_qty,
              product_name: prod.product_name,
            });
          }
        })
      );
      const orderWarehouseAvailable = [
        [
          sequelize.literal(`ST_Distance_Sphere(
        POINT(${warehouseSellerData.longitude}, ${warehouseSellerData.latitude}),
        POINT(Warehouse.longitude, Warehouse.latitude)
      )`),
        ],
      ];
      let stockAvailable = [];
      let stockWarehouseSender = [];
      await Promise.all(
        mutationNeeded?.map(async (el) => {
          let stockNeeded = el.qty;
          const includeWarehouseAvailable = [
            {
              model: stocks,
              where: {
                stock: {
                  [db.Sequelize.Op.gt]: 0,
                },
                id_product: el.id_product,
              },
            },
          ];
          const warehouseIgnore = [id_warehouse_seller];
          const whereWarehouseAvailable = {
            id: {
              [db.Sequelize.Op.notIn]: warehouseIgnore,
            },
          };
          let stockInWarehouseSeller = [el.qty_origin];
          const startSearch = async () => {
            if (warehouseIgnore >= allWarehouse.length) {
              throw new Error(
                "One of this product stock in this transaction or all product is empty at all warehouse!"
              );
            }
            const nearestWarehouse = await warehouse.findAll({
              order: orderWarehouseAvailable,
              where: whereWarehouseAvailable,
              include: includeWarehouseAvailable,
              limit: 1,
            });
            let stockBefore;
            if (nearestWarehouse.length > 0) {
              let stockAfterSend;
              let stockGot;
              if (nearestWarehouse[0].Stocks[0].stock > stockNeeded) {
                stockAfterSend =
                  nearestWarehouse[0].Stocks[0].stock - stockNeeded;
                stockBefore = stockNeeded;
                stockInWarehouseSeller.push(stockNeeded);
                stockGot = stockInWarehouseSeller.reduce((acc, curr) => {
                  return acc + curr;
                }, 0);
              } else {
                stockAfterSend = 0;
                stockBefore = nearestWarehouse[0].Stocks[0].stock;
                stockInWarehouseSeller.push(
                  nearestWarehouse[0].Stocks[0].stock
                );
                stockGot = stockInWarehouseSeller.reduce((acc, curr) => {
                  return acc + curr;
                }, 0);
              }
              stockAvailable.push({
                id: nearestWarehouse[0].Stocks[0].id,
                stock: stockAfterSend,
                id_product: nearestWarehouse[0].Stocks[0].id_product,
                id_warehouse: nearestWarehouse[0].Stocks[0].id_warehouse,
                stockMove: stockBefore,
                stockIncrease: stockGot,
              });
              if (stockAfterSend === 0) {
                warehouseIgnore.push(
                  nearestWarehouse[0].Stocks[0].id_warehouse
                );
                stockNeeded = stockNeeded - nearestWarehouse[0].Stocks[0].stock;
                await startSearch();
              }
            }
          };
          await startSearch();
        })
      );
      if (stockAvailable) {
        await Promise.all(
          stockAvailable.map(async (el) => {
            await stocks.update(
              {
                stock: el.stock,
              },
              { where: { id: el.id } }
            );
            await stocks.update(
              {
                stock: el.stockIncrease,
              },
              {
                where: {
                  id_product: el.id_product,
                  id_warehouse: id_warehouse_seller,
                },
              }
            );
            await stockhistory.create({
              status: "out",
              current_stock: el.stock,
              quantity: el.stockMove,
              id_product: el.id_product,
              id_warehouse: el.id_warehouse,
            });
            await stockmovement.create({
              status: "approved",
              quantity: el.stockMove,
              id_product: el.id_product,
              warehouse_sender_id: el.id_warehouse,
              warehouse_receive_id: id_warehouse_seller,
            });
          })
        );

        await Promise.all(
          stockAvailable.map(async (el) => {
            await stockhistory.create({
              status: "in",
              current_stock: el.stockIncrease,
              quantity: el.stockMove,
              id_product: el.id_product,
              id_warehouse: id_warehouse_seller,
            });
          })
        );
      }

      res.status(200).send({
        warehouseSellerData,
        data: result,
        allProduct,
        allItemRequestQty,
        mutationNeeded,
        noMutationNeeded,
        stockAvailable,
        stockWarehouseSender,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
