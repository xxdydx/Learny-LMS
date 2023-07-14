const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("assignments", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      section_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "sections",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      awskey: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      visibledate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      marks: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    });

    await queryInterface.createTable("submissions", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "assignments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      student_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      awskey: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("assignments");
    await queryInterface.dropTable("submissions");
  },
};
