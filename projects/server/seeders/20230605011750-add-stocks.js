"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Stocks", [
      {
        stock: 10,
        id_product: 1,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 1,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 2,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 2,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 3,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 3,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 4,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 4,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 5,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 5,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 6,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 6,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 7,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 7,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 8,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 8,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 9,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 9,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 10,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 10,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 11,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 11,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 12,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 12,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 13,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 13,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 14,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 10,
        id_product: 14,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 0,
        id_product: 15,
        id_user: 5,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        stock: 0,
        id_product: 15,
        id_user: 6,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Stocks", null, {});
  },
};
