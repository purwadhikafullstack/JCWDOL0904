"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Transactions", [
      {
        total_price: 6399000,
        transaction_date: new Date(),
        courier: "jne",
        status: "On Proses",
        id_address: 1,
        id_ekspedisi: 1,
        id_user: 1,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Transactions", null, {});
  },
};
