const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn(
      "blacklistedtokens", // name of the table to add the column to
      "id", // name of the new column
      {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blacklistedtokens", "id");
  },
};
