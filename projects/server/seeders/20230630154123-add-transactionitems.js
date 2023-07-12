"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("transactionitems", [
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 1,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 2,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 3,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 4,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 5,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 5,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 5,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 5,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 5,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 5,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 5,
      },
      {
        quantity: 1,
        price: 6399000,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_product: 1,
        id_transaction: 5,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("transactionitems", null, {});
  },
};
