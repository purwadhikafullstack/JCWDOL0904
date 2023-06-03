const userController = require("./userController.js");
const TestingMulterController = require("./TestingMulterController.js");
const addressController = require("./addressController.js");
const warehouseController = require("./warehouseController.js");
const nearestWarehouseController = require("./nearestWarehouseController.js");
const authController = require("./authController.js");

module.exports = {
  userController,
  authController,
  TestingMulterController,
  addressController,
  warehouseController,
  nearestWarehouseController,
};
