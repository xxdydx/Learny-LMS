const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("courses", "teacher");
    await queryInterface.removeColumn("courses", "user_ids");
    await queryInterface.addColumn("courses", "teacher", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("courses", "teacher");
    await queryInterface.addColumn("courses", "teacher", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("courses", "user_ids");
  },
};
