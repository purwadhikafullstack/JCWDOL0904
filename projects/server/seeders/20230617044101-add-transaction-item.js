"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Transactionitems", [
      {
        quantity: 12,
        price: 6399000,
        id_product: 1,
        id_transaction: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quantity: 5,
        price: 21999000,
        id_product: 2,
        id_transaction: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quantity: 15,
        price: 17999000,
        id_product: 3,
        id_transaction: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Transactionitems", null, {});
  },
};
