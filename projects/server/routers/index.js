const userRouter = require("./userRouter");
const TestingMulterRouter = require("./TestingMulterRouter")
const addressRouter = require("./addressRouter")
const warehouseRouter = require("./warehouseRouter")
const nearestWarehouseRouter = require("./nearestWarehouseRouter")
const productRouters = require("./productRouters")
const authRouter = require("./authRouter");
const rajaongkirRouter = require("./rajaongkirRouter")


module.exports = {
  userRouter,
  authRouter,
  TestingMulterRouter,
  addressRouter,
  warehouseRouter,
  nearestWarehouseRouter,
  productRouters,
  rajaongkirRouter
};
