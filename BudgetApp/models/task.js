module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    iterations: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },

    complete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  });

  Task.associate = function(models) {
    Task.belongsTo(models.Kid, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Task;
};
