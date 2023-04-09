const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("courses", "user_ids", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    });
    await queryInterface.addColumn("courses", "created_at", {
      type: DataTypes.DATE,
    });
    await queryInterface.addColumn("courses", "updated_at", {
      type: DataTypes.DATE,
    });
    await queryInterface.addColumn("users", "created_at", {
      type: DataTypes.DATE,
    });
    await queryInterface.addColumn("users", "updated_at", {
      type: DataTypes.DATE,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("courses", "user_ids");
    await queryInterface.removeColumn("courses", "created_at");
    await queryInterface.removeColumn("courses", "updated_at");
    await queryInterface.removeColumn("courses", "created_at");
    await queryInterface.removeColumn("courses", "updated_at");
  },
};
