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
const orderController = require("./orderController.js")

const tokenValidatorController = require("./tokenValidatorController.js");
const uploadProfileController = require("./uploadProfileController.js");

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
  orderController
  tokenValidatorController,
  uploadProfileController,
};
