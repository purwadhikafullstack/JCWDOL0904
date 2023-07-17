const userController = require("./userController.js");
const TestingMulterController = require("./TestingMulterController.js");
const addressController = require("./addressController.js");
const warehouseController = require("./warehouseController.js");
const nearestWarehouseController = require("./nearestWarehouseController.js");
const productControllers = require("./productControllers.js");
const authController = require("./authController.js");
const rajaongkirController = require("./rajaongkirController.js");
const cartController = require("./cartController.js");
const expedisiController = require("./ekspedisiController.js");
const promotionControllers = require("./promotionControllers.js");
const orderControllers = require("./orderControllers.js");
const orderPaymentController = require("./orderPaymentController.js");

const tokenValidatorController = require("./tokenValidatorController.js");
const uploadProfileController = require("./uploadProfileController.js");
const mutationAutomaticController = require("./mutationAutomaticController.js");
const mutationControllers = require("./mutationControllers.js");
const categoryControllers = require("./categoryControllers.js");
const orderGetController = require("./orderGetController.js");
const orderAdminController = require("./orderAdminController.js");
const notificationController = require("./notificationController.js");
const notificationReadController = require("./notificationReadController.js")
const stockControllers = require("./stockControllers.js");
const migrationController = require("./migrationController.js");
const stockHistoryController = require("./stockHistoryController.js");
const orderCancelController = require("./orderCancelController.js");

module.exports = {
  userController,
  TestingMulterController,
  addressController,
  warehouseController,
  nearestWarehouseController,
  productControllers,
  authController,
  rajaongkirController,
  cartController,
  expedisiController,
  promotionControllers,
  orderControllers,
  tokenValidatorController,
  uploadProfileController,
  mutationAutomaticController,
  mutationControllers,
  categoryControllers,
  orderPaymentController,
  orderGetController,
  orderAdminController,
  notificationController,
  stockControllers,
  migrationController,
  stockHistoryController,
  orderCancelController,
  notificationReadController
};
