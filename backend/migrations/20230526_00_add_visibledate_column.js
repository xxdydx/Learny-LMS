const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("files", "visibledate", {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("files", "visibledate");
  },
};
