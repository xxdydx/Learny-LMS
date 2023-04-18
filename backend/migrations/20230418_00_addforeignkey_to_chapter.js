const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("chapters", "course_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("chapters", "course_id");
  },
};
