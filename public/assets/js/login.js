$(function() {
  $(".login").on("click", function() {
    console.log(
      $("#userLogin")
        .val()
        .trim()
    );
    console.log(
      $("#passLogin")
        .val()
        .trim()
    );
    let sendObj = {
      userName: $("#userLogin")
        .val()
        .trim(),
      password: $("#passLogin")
        .val()
        .trim()
    };
    $.ajax("/api/login", {
      type: "POST",
      data: sendObj
    }).then(result => {
      console.log(result);
      // location.assign(result.page);
      window.location.replace(result);
    });
  });

  $(".signup").on("click", function() {
    console.log(
      $("#nameSign")
        .val()
        .trim()
    );
    console.log(
      $("#userSign")
        .val()
        .trim()
    );
    console.log(
      $("#passSign")
        .val()
        .trim()
    );
    console.log(
      $("#pinSign")
        .val()
        .trim()
    );
    var newUser = {
      name: $("#nameSign")
        .val()
        .trim(),
      userName: $("#userSign")
        .val()
        .trim(),
      password: $("#passSign")
        .val()
        .trim(),
      pin: $("#pinSign")
        .val()
        .trim()
    };

    $.ajax("/api/signup", {
      type: "POST",
      data: newUser
    }).then(result => {
      console.log(result);
      window.location.replace(result);
    });
  });
});
