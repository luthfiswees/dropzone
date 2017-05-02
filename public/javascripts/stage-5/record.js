// Record action
$(document).ready(function(){
  // Action regarding box
  $('#box-1').click(function(event){
    // Send action record to backend
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'click blue box', // This is the name of the action
        'stage' : '5'
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
        'action': 'click green box', // This is the name of the action
        'stage' : '5'
      },
      success: function(msg){
        console.log("nice");
      }
    });
  });
  $('#box-3').click(function(event){
    // Send action record to backend
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'click red box', // This is the name of the action
        'stage' : '5'
      },
      success: function(msg){
        console.log("nice");
      }
    });
  });
  $('#box-4').click(function(event){
    // Send action record to backend
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'click yellow box', // This is the name of the action
        'stage' : '5'
      },
      success: function(msg){
        console.log("nice");
      }
    });
  });
});
