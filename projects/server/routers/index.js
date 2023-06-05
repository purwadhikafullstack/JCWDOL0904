const userRouter = require("./userRouter");
const TestingMulterRouter = require("./TestingMulterRouter")
const addressRouter = require("./addressRouter")
const warehouseRouter = require("./warehouseRouter")
const nearestWarehouseRouter = require("./nearestWarehouseRouter")
const productRouters = require("./productRouters")

module.exports = {
  userRouter,
  TestingMulterRouter,
  addressRouter,
  warehouseRouter,
  nearestWarehouseRouter,
  productRouters
};
