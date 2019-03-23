$(function() {
  var hidden = "";
  $(".atag").on("click", function() {
    $(".atag").removeClass("activeTag");
    $(this).addClass("activeTag");
    var show = $(this).attr("data-show");
    var hide = $(this).attr("data-hide");
    if (hide !== hidden) {
      $(".formArea").addClass("show");
      $(".form").removeClass("show");
      $("#" + show).addClass("show");
      hidden = hide;
      return;
    }
    $(".formArea").removeClass("show");
    $(".form").removeClass("show");
    $(".atag").removeClass("activeTag");
    hidden = "";
  });
});
