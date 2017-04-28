// Show instructions
$(document).ready(function(){
  // Show instruction popup
  $('#ilm-instruction-button').click(function(event){
    $('#ilm-modal-box-instruction').show();
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'open instruction', // This is the name of the action
        'stage' : '3'
      },
      success: function(msg){
        console.log("nice");
      }
    });
  });

  // Close instruction popup
  $('#close-modal-box-insruction').click(function(event){
    $('#ilm-modal-box-instruction').hide();
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'close instruction', // This is the name of the action
        'stage' : '3'
      },
      success: function(msg){
        console.log("nice");
      }
    });
  });
});
