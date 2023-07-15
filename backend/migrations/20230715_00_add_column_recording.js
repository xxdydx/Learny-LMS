const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn(
      "recordings", // name of the table to add the column to
      "teacher_id",
      {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        defaultValue: 6,
        onDelete: "CASCADE",
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("recordings", "teacher_id");
  },
};
