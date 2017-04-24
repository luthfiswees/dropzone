// Initialize array variable for collecting action data
// var request = require("request");
//
// window.user_actions = [];
// localStorage.setItem("user_actions", "[]");

// Record action
$(document).ready(function(){
  // Action regarding box
  $('#box-1').click(function(event){
    // window.user_actions.push({
    //   action: "click blue box",
    //   timestamp: Date.getTime()
    // });
    $.post('/api/test', function(){
      console.log("Ajax success");
    });
    // localStorage.setItem("user_actions", (JSON.parse(localStorage.getItem("user_actions"))).push({
    //   action: "click blue box",
    //   timestamp: Date.getTime()
    // }));
  });
  $('#box-2').click(function(event){
    window.user_actions.push({
      action: "click green box",
      timestamp: Date.getTime()
    });
    // localStorage.setItem("user_actions", (JSON.parse(localStorage.getItem("user_actions"))).push({
    //   action: "click green box",
    //   timestamp: Date.getTime()
    // }));
  });

  // Regarding show data
  $("#ilm-button-show-data").click(function(){
    $.ajax({
      url: "/api/show_data",
      type: "get", //send it through get method
      data: {
        array: window.user_actions
      },
      success: function(response) {
        //Do Something
        console.log("sukses");
      },
      error: function(xhr) {
        //Do Something to handle error
        console.log("error");
      }
    });
  });
});
