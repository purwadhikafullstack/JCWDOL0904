"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("transactions", [
      {
        total_price: 6399000,
        invoice_number: 11111,
        payment_proof: null,
        transaction_date: "2023-06-28",
        expired: new Date(),
        status: "Order Confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        id_address: 1,
        id_ekspedisi: 1,
        id_user: 2,
        id_warehouse: 1,
      },
      {
        total_price: 6399000,
        invoice_number: 22222,
        payment_proof: null,
        transaction_date: "2023-06-29",
        expired: new Date(),
        status: "Order Confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        id_address: 2,
        id_ekspedisi: 2,
        id_user: 1,
        id_warehouse: 2,
      },
      {
        total_price: 6399000,
        invoice_number: 33333,
        payment_proof: null,
        transaction_date: "2023-06-30",
        expired: new Date(),
        status: "Order Confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        id_address: 3,
        id_ekspedisi: 1,
        id_user: 2,
        id_warehouse: 3,
      },
      {
        total_price: 6399000,
        invoice_number: 44444,
        payment_proof: null,
        transaction_date: "2023-07-01",
        expired: new Date(),
        status: "Order Confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        id_address: 1,
        id_ekspedisi: 2,
        id_user: 2,
        id_warehouse: 1,
      },
      {
        total_price: 6399000,
        invoice_number: 55555,
        payment_proof: null,
        transaction_date: "2023-07-02",
        expired: new Date(),
        status: "Order Confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
        id_address: 2,
        id_ekspedisi: 2,
        id_user: 1,
        id_warehouse: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("transactions", null, {});
  },
};
