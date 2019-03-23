var pin = "";
$(function() {
  $.ajax("/api/user_data", {
    type: "GET"
  }).then(data => {
    console.log(data);
    console.log(data.name);
    $("#userName").text(data.name);
    pin = data.pin;
    data.kidData.forEach(kid => {
      let newKid = $("<a>")
        .attr("class", "kidBtn")
        .text(kid.name)
        .attr("data-id", kid.id)
        .attr("href", "/kid/" + kid.id);
      $(".kidArea").append(newKid);
    });
  });
  var inputPin = "";
  $(".number").on("click", function() {
    console.log("number " + $(this).attr("data-number"));
    if (inputPin.length < 4) {
      inputPin += $(this).attr("data-number");
      $(".display").text(inputPin);
      console.log(inputPin.length + " inputPin length");
    }
  });

  $(".back").on("click", function() {
    console.log("delete last number");

    var newPin = inputPin.substring(0, inputPin.length - 1);
    inputPin = newPin;
    $(".display").text(inputPin);
  });

  $(".sendPin").on("click", function() {
    var tryPin = parseInt($(".display").text());
    console.log(tryPin);
    console.log(pin);
    if (tryPin === pin) {
      console.log("would send");
      window.location.replace("/parent");
    }
  });
});
