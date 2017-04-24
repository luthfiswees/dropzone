// Show instructions
$(document).ready(function(){
  // Show instruction popup
  $('#ilm-instruction-button').click(function(event){
    $('#ilm-modal-box-instruction').show();
    window.user_actions.push({
      action: "close instruction",
      timestamp: Date.getTime()
    });
    // localStorage.setItem("user_actions", (JSON.parse(localStorage.getItem("user_actions"))).push({
    //   action: "close instruction",
    //   timestamp: Date.getTime()
    // }));
  });

  // Close instruction popup
  $('#close-modal-box-insruction').click(function(event){
    $('#ilm-modal-box-instruction').hide();
    window.user_actions.push({
      action: "open instruction",
      timestamp: Date.getTime()
    });
    // localStorage.setItem("user_actions", (JSON.parse(localStorage.getItem("user_actions"))).push({
    //   action: "open instruction",
    //   timestamp: Date.getTime()
    // }));
  });
});
