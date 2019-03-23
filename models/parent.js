var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var Parent = sequelize.define("Parent", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    pin: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Parent.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  Parent.hook("beforeCreate", function(parent) {
    parent.password = bcrypt.hashSync(
      parent.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  Parent.associate = function(models) {
    Parent.hasMany(models.Kid, {
      onDelete: "cascade"
    });
  };

  return Parent;
};
