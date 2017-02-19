// Show instructions
$(document).ready(function(){
  // Show instruction popup
  $('#ilm-instruction-button').click(function(event){
    $('#ilm-modal-box-instruction').show();
  });

  // Close instruction popup
  $('#close-modal-box-insruction').click(function(event){
    $('#ilm-modal-box-instruction').hide();
  });
});
