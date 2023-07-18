"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        fullname: "Zainur Rouf",
        username: "zainur",
        email: "zainur@gmail.com",
        password:
          "$2b$10$IErJfvcG2fEJ33lbVPP2HOomu//t9JiiiUuBh9m6hStQFS5NpWAlu",
        is_verified: true,
        user_image: "avatar_default.jpg",
        role: "user",
        verify_token: null,
        id_warehouse: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Asep Angga Ihza Sukarya",
        username: "asep",
        email: "asep@gmail.com",
        password:
          "$2b$10$IErJfvcG2fEJ33lbVPP2HOomu//t9JiiiUuBh9m6hStQFS5NpWAlu",
        is_verified: true,
        user_image: "avatar_default.jpg",
        role: "user",
        verify_token: null,
        id_warehouse: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Adii",
        username: "adi",
        email: "alexiusnicholas@gmail.com",
        password: "123",
        is_verified: true,
        user_image: "avatar_default.jpg",
        role: "user",
        verify_token: null,
        id_warehouse: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Admin",
        username: "admin",
        email: "admin@gmail.com",
        password:
          "$2b$10$IErJfvcG2fEJ33lbVPP2HOomu//t9JiiiUuBh9m6hStQFS5NpWAlu",
        is_verified: true,
        user_image: "avatar_default.jpg",
        role: "admin",
        verify_token: null,
        id_warehouse: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Admin Bandung",
        username: "adminW1",
        email: "wbandunga@gmail.com",
        password:
          "$2b$10$IErJfvcG2fEJ33lbVPP2HOomu//t9JiiiUuBh9m6hStQFS5NpWAlu",
        is_verified: true,
        user_image: "avatar_default.jpg",
        role: "adminWarehouse",
        verify_token: null,
        id_warehouse: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_warehouse: 1,
      },
      {
        fullname: "Admin Surabaya",
        username: "adminW2",
        email: "warehousea88@gmail.com",
        password:
          "$2b$10$IErJfvcG2fEJ33lbVPP2HOomu//t9JiiiUuBh9m6hStQFS5NpWAlu",
        is_verified: true,
        user_image: "avatar_default.jpg",
        role: "adminWarehouse",
        verify_token: null,
        id_warehouse: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_warehouse: 2,
      },
      {
        fullname: "Admin Yogyakarta",
        username: "adminW3",
        email: "fiproJCW041@gmail.com",
        password:
          "$2b$10$IErJfvcG2fEJ33lbVPP2HOomu//t9JiiiUuBh9m6hStQFS5NpWAlu",
        is_verified: true,
        user_image: "avatar_default.jpg",
        role: "adminWarehouse",
        verify_token: null,
        id_warehouse: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        id_warehouse: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
