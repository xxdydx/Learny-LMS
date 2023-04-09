const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("users", "password_hash", {
      type: DataTypes.TEXT,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("courses", "password_hash");
  },
};
