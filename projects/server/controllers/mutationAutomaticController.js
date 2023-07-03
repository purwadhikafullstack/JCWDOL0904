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

      const whereWarehouseAvailable = {
        id: {
          [db.Sequelize.Op.not]: id_warehouse_seller,
        },
      };

      let warehouseAvailable = [];
      let stockIsEmpty = [];
      await Promise.all(
        mutationNeeded?.map(async (el) => {
          const includeWarehouseAvailable = [
            {
              model: stocks,
              where: {
                stock: {
                  [db.Sequelize.Op.gt]: el.qty - 1,
                },
                id_product: el.id_product,
              },
            },
          ];

          const nearestWarehouse = await warehouse.findAll({
            order: orderWarehouseAvailable,
            where: whereWarehouseAvailable,
            include: includeWarehouseAvailable,
            limit: 1,
          });
          if (nearestWarehouse.length > 0) {
            warehouseAvailable.push(nearestWarehouse);
          } else if (nearestWarehouse.length < 1) {
            stockIsEmpty.push({
              id_product: el.id_product,
              stock: el.qty,
              product_name: el.product_name,
            });
          }
        })
      );

      if (stockIsEmpty.length > 0) {
        await transaction.update(
          {
            status: "rejected",
          },
          {
            where: {
              id,
            },
          }
        );
        return res.status(400).send({
          data: stockIsEmpty,
          message: "stock is empty on every warehouse",
        });
      }

      let stockAvailable = [];
      warehouseAvailable.forEach((el) => {
        el.forEach((stock) => {
          stockAvailable.push(stock.Stocks[0]);
        });
      });

      const updateStock = stockAvailable.map((el) => {
        const mutationItem = mutationNeeded.find(
          (item) => item.id_product === el.id_product
        );
        if (mutationItem) {
          return {
            id: el.id,
            stock: el.stock - mutationItem.qty,
            id_product: el.id_product,
          };
        }
      });

      await Promise.all(
        updateStock?.map(async (el) => {
          await stocks.update(
            {
              stock: el.stock,
            },
            {
              where: {
                id: el.id,
              },
            }
          );
        })
      );

      let updateReceiveStock = mutationNeeded?.map((el) => {
        const receiveItem = allProduct.find(
          (item) => item.id_product === el.id_product
        );
        if (receiveItem) {
          return {
            id: receiveItem.id,
            stock: el.qty + receiveItem.stock,
            id_product: el.id_product,
          };
        }
      });

      await Promise.all(
        updateReceiveStock?.map(async (el) => {
          await stocks.update(
            {
              stock: el.stock,
            },
            {
              where: {
                id: el.id,
              },
            }
          );
        })
      );

      const currentTime = new Date();
      let request_number = currentTime.getTime();
      request_number = request_number.toString();
      request_number = request_number.substring(0, 5);
      request_number = parseInt(request_number);

      await Promise.all(
        warehouseAvailable.map(async (el) => {
          const stockNeeded = mutationNeeded.find(
            (item) => item.id_product === el[0].Stocks[0].id_product
          );
          if (stockNeeded) {
            await stockmovement.create({
              warehouse_sender_id: el[0].id,
              status: "approved",
              id_product: el[0].Stocks[0].id_product,
              quantity: stockNeeded.qty,
              warehouse_receive_id: id_warehouse_seller,
              request_number: request_number,
            });
            await stockhistory.create({
              id_product: el[0].Stocks[0].id_product,
              quantity: stockNeeded.qty,
              reference: request_number,
              status: "out",
            });
            await stockhistory.create({
              id_product: el[0].Stocks[0].id_product,
              quantity: stockNeeded.qty,
              reference: request_number,
              status: "in",
            });
          }
        })
      );

      res.status(200).send({
        warehouseSellerData,
        data: result,
        allProduct,
        allItemRequestQty,
        mutationNeeded,
        noMutationNeeded,
        warehouseAvailable,
        stockAvailable,
        updateStock,
        updateReceiveStock,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
