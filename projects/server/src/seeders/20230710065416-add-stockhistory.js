"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("stockhistories", [
      {
        quantity: 15,
        status: "in",
        current_stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_warehouse: 1,
      },
      {
        quantity: 12,
        status: "out",
        current_stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 2,
        id_warehouse: 2,
      },
      {
        quantity: 9,
        status: "in",
        current_stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 3,
        id_warehouse: 3,
      },
      {
        quantity: 5,
        status: "out",
        current_stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 4,
        id_warehouse: 1,
      },
      {
        quantity: 15,
        status: "in",
        current_stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 5,
        id_warehouse: 2,
      },
      {
        quantity: 15,
        status: "out",
        createdAt: new Date(),
        updatedAt: new Date(),
        current_stock: 10,
        id_product: 6,
        id_warehouse: 3,
      },
      {
        quantity: 15,
        status: "in",
        createdAt: new Date(),
        updatedAt: new Date(),
        current_stock: 10,
        id_product: 7,
        id_warehouse: 1,
      },
      {
        quantity: 15,
        status: "out",
        createdAt: new Date(),
        updatedAt: new Date(),
        current_stock: 1,
        id_product: 8,
        id_warehouse: 2,
      },
      {
        quantity: 15,
        status: "in",
        createdAt: new Date(),
        updatedAt: new Date(),
        current_stock: 10,
        id_product: 9,
        id_warehouse: 3,
      },
      {
        quantity: 15,
        status: "out",
        createdAt: new Date(),
        updatedAt: new Date(),
        current_stock: 10,
        id_product: 10,
        id_warehouse: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("stockhistories", null, {});
  },
};
