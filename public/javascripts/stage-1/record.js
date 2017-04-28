// Record action
$(document).ready(function(){
  // Action regarding box
  $('#box-1').click(function(event){
    // Send action record to backend
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'click blue box' // This is the name of the action
      },
      success: function(msg){
        console.log("nice");
      }
    });
  });
  $('#box-2').click(function(event){
    // Send action record to backend
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'click green box' // This is the name of the action
      },
      success: function(msg){
        console.log("nice");
      }
    });
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
