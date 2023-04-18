const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("courses", "teacher");
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("courses", "teacher", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    });
  },
};
