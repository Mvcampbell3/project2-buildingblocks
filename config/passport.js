var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

passport.use(
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: "userName"
    },
    function(userName, password, done) {
      // When a user tries to sign in this code runs
      db.Parent.findOne({
        where: {
          userName: userName
        }
      }).then(function(dbParent) {
        // If there's no Parent with the given email
        if (!dbParent) {
          return done(null, false, {
            message: "Incorrect user name."
          });
        }
        // If there is a Parent with the given email, but the password the Parent gives us is incorrect
        else if (!dbParent.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the Parent
        return done(null, dbParent);
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
