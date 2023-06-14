const userRouter = require("./userRouter");
const TestingMulterRouter = require("./TestingMulterRouter");
const addressRouter = require("./addressRouter");
const warehouseRouter = require("./warehouseRouter");
const nearestWarehouseRouter = require("./nearestWarehouseRouter");
const productRouters = require("./productRouters");
const authRouter = require("./authRouter");
const rajaongkirRouter = require("./rajaongkirRouter");
const cartRouter = require("./cartRouter");
const ekpedisiRouter = require("./ekspedisiRouter");
const promotionRouter = require("./promotionRouter");
const tokenValidatorRouter = require("./tokenValidatorRouter");

module.exports = {
  userRouter,
  authRouter,
  TestingMulterRouter,
  addressRouter,
  warehouseRouter,
  nearestWarehouseRouter,
  productRouters,
  rajaongkirRouter,
  cartRouter,
  ekpedisiRouter,
  promotionRouter,
  tokenValidatorRouter,
};
