$(function() {
  var progressBars = [].slice.call(document.querySelectorAll(".progressBar"));
  progressBars.forEach(one => {
    var numberProStr = one.dataset.progress;
    var numberItStr = one.dataset.iterations;
    var proWidth = parseFloat(numberProStr / numberItStr).toFixed(2) * 100;
    // one.style.width = proWidth + "%";
    var pos = 0;
    var timer = setInterval(function() {
      if (pos >= proWidth) {
        clearInterval(timer);
        one.style.width = proWidth + "%";
      } else {
        one.style.width = pos + "%";
        pos = pos + 0.5;
      }
    }, 8);
  });

  $.ajax("/api/kid/" + $(".statusBar").attr("data-id"), {
    type: "GET"
  }).then(result => {
    console.log(result);
    $("#kidName").text(result.kid.name);
  });
});
