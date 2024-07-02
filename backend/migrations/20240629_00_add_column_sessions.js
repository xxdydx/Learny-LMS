const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn(
      "sessions", // name of the table to add the column to
      "token", // name of the new column
      {
        type: DataTypes.STRING,
        allowNull: true,
      }
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("sessions", "token");
  },
};
