// var path = require("path");

var isAuthenticated = require("../config/middleware/isAuthenticaed");
var db = require("../models");

module.exports = function(app) {
  app.get("/", (req, res) => {
    if (req.parent) {
      res.render("index");
    }
    res.render("landing");
  });

  // app.get("/signup", (req, res) => {
  //     if (req.parent) {
  //         res.render("index");
  //     };
  //     res.render("signup");
  // })

  app.get("/members", isAuthenticated, function(req, res) {
    res.render("index");
  });

  app.get("/kid/:id", isAuthenticated, function(req, res) {
    if (req.user) {
      var kidId = req.params.id;
      db.Task.findAll({
        where: {
          KidId: kidId
        }
      }).then(function(data) {
        var sendObj = {
          task: data
        };
        // console.log(sendObj);
        res.render("kid", sendObj);
      });
    }
  });
  app.get("/parent", isAuthenticated, function(req, res) {
    res.render("parent");
  });
};
