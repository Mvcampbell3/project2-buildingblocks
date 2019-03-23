module.exports = function(sequelize, DataTypes) {
  var Kid = sequelize.define("Kid", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    rewardName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    rewardValue: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Kid.associate = function(models) {
    Kid.belongsTo(models.Parent, {
      foreignKey: {
        allowNull: false
      }
    });

    Kid.hasMany(models.Task, {
      onDelete: "cascade"
    });
  };
  return Kid;
};
