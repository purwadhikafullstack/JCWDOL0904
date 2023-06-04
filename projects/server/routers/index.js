const userRouter = require("./userRouter");
const TestingMulterRouter = require("./TestingMulterRouter");
const addressRouter = require("./addressRouter");
const warehouseRouter = require("./warehouseRouter");
const nearestWarehouseRouter = require("./nearestWarehouseRouter");
const authRouter = require("./authRouter");

module.exports = {
  userRouter,
  authRouter,
  TestingMulterRouter,
  addressRouter,
  warehouseRouter,
  nearestWarehouseRouter,
};
