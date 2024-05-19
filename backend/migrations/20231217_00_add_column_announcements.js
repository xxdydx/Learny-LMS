
const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn(
      "announcements", // name of the table to add the column to
      "course_id", // name of the new column
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
        onDelete: "CASCADE",
        
      })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("recordings", "duration");
  },
};
