// var userName = "";
var kidData = "";
var userId = "";

$(function() {
  $.ajax("/api/user_data/parent", {
    type: "GET"
  }).then(function(result) {
    console.log(result);
    userId = result.id;
    kidData = result.kidData;
    kidData.forEach(kid => {
      let kidBox = $("<div>").attr("class", "kidBox");
      let newDel = $("<button>")
        .attr("class", "btn btn-danger deleteKid third")
        .text("Delete")
        .attr("data-kid", kid.id);
      let newTask = $("<button>")
        .attr("class", "btn btn-info createTask third change")
        .text("Add task")
        .attr("data-kid", kid.id)
        .attr("data-input", "addTask");
      let newEdit = $("<button>")
        .attr("class", "btn btn-success editKid third change")
        .text("Reward")
        .attr("data-kid", kid.id)
        .attr("data-input", "reward");
      let taskBox = $("<div>").attr("class", "taskBox container");
      let rewWand = "";
      if (kid.rewardName) {
        rewWand = kid.rewardName;
      }
      let kidName = $("<h3>")
        .attr("class", "kidName third")
        .html(kid.name + ": <br>" + rewWand);

      let startFlex = $("<div>").attr("class", "startFlex");
      startFlex.append(kidName, newEdit, newTask, newDel);

      kid.Tasks.forEach(task => {
        let taskDiv = $("<div>").attr("class", "taskDiv");
        let taskFlex = $("<div>").attr("class", "taskFlex");
        let taskName = $("<h3>")
          .attr("class", "taskName taskThing")
          .text(task.name);
        let taskDelBtn = $("<div>")
          .attr("class", "taskDelBtn")
          .attr("data-id", task.id)
          .html("<i class='fas fa-minus-circle'></i>");
        let newIterations = $("<h4>")
          .attr("class", "iterations taskThing")
          .text("Iterations: " + task.iterations);
        let newProgress = $("<h4>")
          .attr("class", "progressT taskThing")
          .text("Progress: " + task.progress);
        let proBtn = $("<div>")
          .attr("class", "proBtn taskThing")
          .attr("data-taskId", task.id)
          .attr("data-current", task.progress)
          .attr("data-iterations", task.iterations)
          .html("<i class='fas fa-plus-circle'></i>");
        let isCom = "";
        if (task.complete) {
          isCom = "Yes!";
        } else {
          isCom = "Not Yet";
        }
        let complete = $("<h4>")
          .attr("class", "completeT taskThing")
          .text("Completed: " + isCom);
        let proArea = $("<div>").attr("class", "proArea");
        proArea.append(newProgress, proBtn);
        taskFlex.append(taskName, taskDelBtn);
        taskDiv.append(taskFlex, newIterations, proArea, complete);
        taskBox.append(taskDiv);
      });

      kidBox.append(startFlex, taskBox);
      $(".kidArea").append(kidBox);
    });

    $(".addKid").on("click", addKid);

    $("body").on("click", ".deleteKid", makeSure);

    $("body").on("click", ".change", showInput);

    $(".addTaskBtn").on("click", addTaskSumbit);

    $(".editRewBtn").on("click", editRewardSubmit);

    $("body").on("click", ".proBtn", changeProgress);

    $("body").on("click", ".taskDelBtn", delTaskSubmit);

    $(".closeBtn").on("click", hideInput);
  });
});

function addKid() {
  let sendKid = {
    name: $("#kidNameAdd")
      .val()
      .trim(),
    parentId: userId
  };
  $.ajax("/api/kid", {
    type: "POST",
    data: sendKid
  }).then(result => {
    console.log(result);
    location.reload();
  });
}

function makeSure() {
  $("body").off("click", makeSure);
  $(this).text("Are You Sure");
  $(this).on("click", deleteKid);
}

function deleteKid() {
  let kidId = $(this).attr("data-kid");
  $.ajax("/api/kid/" + kidId, {
    type: "DELETE"
  }).then(result => {
    console.log(result);
    location.reload();
  });
}

function showInput() {
  console.log("clicked");
  $(".myForm").hide();
  $(".myForm").attr("data-id", $(this).attr("data-kid"));
  $(".inputAnyForm").fadeIn();
  switch ($(this).attr("data-input")) {
  case "addTask":
    $(".addTask").show();
    break;
  case "reward":
    $(".editRewards").show();
    break;
  default:
    console.log("showInput switch not working as expected");
  }
}

function hideInput() {
  $(".inputAnyForm").fadeOut();
}

function addTaskSumbit() {
  let name = $("#taskNameAdd").val().trim();
  let value = $("#taskValueAdd").val().trim();
  let iterationsAdd = $("#iterationsAdd").val().trim();

  let newTaskSend = {
    name: name,
    value: value,
    iterations: iterationsAdd,
    KidId: $(".myForm").attr("data-id")
  };

  if (name && value && iterationsAdd) {
    $.ajax("/api/task", {
      type: "POST",
      data: newTaskSend
    }).then(result => {
      console.log(result);
      location.reload();
    });
  }
}

function editRewardSubmit() {
  let rewardName = $("#rewardNameAdd").val().trim();
  let rewardValue = $("#rewardValueAdd").val().trim();

  let newRewardSend = {
    rewardName: rewardName,
    rewardValue: rewardValue,
    KidId: $(".myForm").attr("data-id")
  };

  if (rewardName && rewardValue) {
    $.ajax("/api/kid", {
      type: "PUT",
      data: newRewardSend
    }).then(result => {
      console.log(result);
      location.reload();
    });
  }
}

function changeProgress() {
  let taskChgId = $(this).attr("data-taskId");
  let oldPro = $(this).attr("data-current");
  oldPro = parseInt(oldPro);
  let iterations = $(this).attr("data-iterations");
  iterations = parseInt(iterations);
  if (oldPro < iterations) {
    let newPro = oldPro + 1;

    let sendNewPro = {
      progress: newPro,
      id: taskChgId
    };
    console.log(taskChgId);
    $.ajax("/api/task/progress", {
      type: "PUT",
      data: sendNewPro
    }).then(result => {
      console.log(result);
      if (newPro === iterations){
        let sendComp = {
          complete: true,
          id: taskChgId
        };
        $.ajax("/api/task/complete", {
          type: "PUT",
          data: sendComp
        }).then(earp => {
          console.log(earp);
        });
      }
      location.reload();
    });
  }
}

function delTaskSubmit() {
  $.ajax("api/task/"+$(this).attr("data-id"), {
    type: "DELETE"
  }).then(result => {
    console.log(result);
    location.reload();
  });
}