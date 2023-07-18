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
const orderRouter = require("./orderRouter");
const tokenValidatorRouter = require("./tokenValidatorRouter");
const uploadProfileRouter = require("./uploadProfileRouter");
const mutationRouter = require("./mutationRouters");
const categoryRouters = require("./categoryRouters");
const notificationRouter = require("./notificationRouter");
const stockRouter = require("./stockRouters");
const migrationRouter = require("./migrationRouter");
const transactionRouter = require("./transactionsRouter");
const stockHistoryRouter = require("./stockHistoryRouter");
const dashboardRouter = require("./dashboardRouter");

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
  orderRouter,
  tokenValidatorRouter,
  uploadProfileRouter,
  mutationRouter,
  categoryRouters,
  notificationRouter,
  stockRouter,
  migrationRouter,
  transactionRouter,
  stockHistoryRouter,
  dashboardRouter,
};
