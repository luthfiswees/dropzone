// Set Initial Time
function setInitialTime(initialtime){
  $("#ilm-time-box-value").html(function(index, currentcontent){
    return initialtime;
  });
}

// Set on close blocker
window.onbeforeunload = function (e) {
    e = e || window.event;
    // For IE and Firefox prior to version 4
    if (!win || !out) {
        e.returnValue = 'Are you sure you want to quit?';
    }
};

// Countdown the timer
$(document).ready(function(){
  setInitialTime(10);

  var timer = setInterval(function() {

    var count = parseInt($('#ilm-time-box-value').html());
    if (count !== 0 && !win) {
      $('#ilm-time-box-value').html(count - 1);
    } else {
      clearInterval(timer);
      out = true;

      // Show up the popup
      if (!win){
          $('#ilm-modal-box-lose').show();
      }
    }
  }, 1000);
});
