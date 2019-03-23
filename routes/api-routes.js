var db = require("../models");
var passport = require("../config/passport");
var seedFile = require("../seeds");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.Parent.create({
      name: req.body.name,
      userName: req.body.userName,
      password: req.body.password,
      pin: req.body.pin
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
  });

  app.get("/seedme", (req, res) => {
    seedFile();
    res.json({ seeded: true });
  });

  app.post("/api/kid", (req, res) => {
    db.Kid.create({
      name: req.body.name,
      rewardName: req.body.rewardName || null,
      rewardValue: req.body.rewardValue || null,
      ParentId: req.body.parentId
    }).then(function(result) {
      res.json(result);
    });
  });

  app.post("/api/task", (req, res) => {
    db.Task.create({
      name: req.body.name,
      value: req.body.value,
      iterations: req.body.iterations,
      // progress: req.body.progress || null,
      // complete: req.body.compete || null,
      KidId: req.body.KidId
    }).then(function(result) {
      res.json(result);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/kid/:id", (req, res) => {
    let dataId = req.params.id;
    db.Kid.findOne({
      where: {
        id: dataId
      }
    }).then(result => {
      if (result.ParentId === req.user.id) {
        res.json({ kid: result });
      }
    });
  });

  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({ login: false });
    } else {
      db.Kid.findAll({
        where: {
          ParentId: req.user.id
        }
      }).then(kids => {
        var kidData = kids;
        res.json({
          // userName: req.parent.userName,
          // id: req.parent.id
          login: true,
          id: req.user.id,
          name: req.user.name,
          userName: req.user.userName,
          pin: req.user.pin,
          kidData: kidData
        });
      });
    }
  });

  app.get("/api/user_data/parent", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({ login: false });
    } else {
      db.Kid.findAll({
        where: {
          ParentId: req.user.id
        },
        include: [
          {
            model: db.Task
          }
        ]
      }).then(kids => {
        res.json({
          login: true,
          id: req.user.id,
          name: req.user.name,
          userName: req.user.userName,
          pin: req.user.pin,
          kidData: kids
        });
      });
    }
  });

  app.get("/test", (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.json({ user: false });
    }
  });

  // This is for setting the progress
  // Could be used with a button click to increase progress for task
  app.put("/api/task/progress", (req, res) => {
    if (req.user) {
      db.Task.update(
        {
          progress: req.body.progress
        },
        {
          where: {
            id: req.body.id
          }
        }
      ).then(function(result) {
        res.json(result);
      });
    } else {
      res.json({ user: false });
    }
  });

  // Used to update if task is complete or not
  // input either true or false
  app.put("/api/task/complete", (req, res) => {
    if (req.user) {
      db.Task.update(
        {
          complete: req.body.complete
        },
        {
          where: {
            id: req.body.id
          }
        }
      ).then(function(result) {
        res.json(result);
      });
    } else {
      res.json({ user: false });
    }
  });

  // This is going to update everything in the task
  // Use this if you have form with all of the information there
  // Have the input values be populated with information from the task
  app.put("/api/task", function(req, res) {
    if (req.user) {
      db.Task.update(
        {
          name: req.body.name,
          value: req.body.value,
          iterations: req.body.iterations,
          progress: req.body.progress || null,
          complete: req.body.complete || null
        },
        {
          where: {
            id: req.body.id
          }
        }
      ).then(function(result) {
        res.json(result);
      });
    } else {
      res.json({ user: false });
    }
  });

  // Update the information about the reward for the kid
  // In this instance, not going to allow for null values
  app.put("/api/kid", function(req, res) {
    if (req.user) {
      db.Kid.update(
        {
          rewardName: req.body.rewardName,
          rewardValue: req.body.rewardValue
        },
        {
          where: {
            id: req.body.KidId
          }
        }
      ).then(function(result) {
        res.json(result);
      });
    } else {
      res.json({ user: false });
    }
  });

  // Delete kid from kids table
  // Tasks associated with this kid will also be deleted from tasks table
  // Gated to only allow the parent who has foreign key id can delete
  app.delete("/api/kid/:id", function(req, res) {
    if (req.user) {
      var idParam = req.params.id;
      db.Kid.findOne({
        where: {
          id: idParam
        }
      }).then(function(result) {
        if (result.ParentId === req.user.id) {
          db.Kid.destroy({
            where: {
              id: idParam
            }
          }).then(function(deleted) {
            res.json(deleted);
          });
        }
      });
    } else {
      res.json({ user: false });
    }
  });

  // This route will delete task that has the id that is in params
  // only if the task's kid's parent id is the same as the user id
  app.delete("/api/task/:id", function(req, res) {
    if (req.user) {
      var taskId = req.params.id;
      db.Task.findOne({
        where: {
          id: taskId
        }
      }).then(function(taskResult) {
        db.Kid.findOne({
          where: {
            id: taskResult.KidId
          }
        }).then(function(kidResult) {
          db.Parent.findOne({
            where: {
              id: kidResult.ParentId
            }
          }).then(function(parentResult) {
            if (kidResult.ParentId === parentResult.id) {
              db.Task.destroy({
                where: {
                  id: taskId
                }
              }).then(function(deleted) {
                res.json(deleted);
              });
            }
          });
        });
      });
    } else {
      res.json({ user: false });
    }
  });
};
