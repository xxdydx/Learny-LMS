const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("courses", "created_at", {
      type: DataTypes.DATE,
    });
    await queryInterface.addColumn("courses", "updated_at", {
      type: DataTypes.DATE,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("courses", "created_at");
    await queryInterface.removeColumn("courses", "updated_at");
  },
};
