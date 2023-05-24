const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("files", "awskey", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("files", "awskey");
  },
};
