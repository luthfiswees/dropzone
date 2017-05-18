$(document).ready(function(){
  $('#close-modal-box-introduction-1').click(function(event){
    $('#ilm-modal-box-introduction-1').hide();
    setInitialTime(10);
    var boolean_go     = false;
    var boolean_ready  = false;
    var boolean_timer  = false;
    var start          = false;
    var prepare = setInterval(function(){
      if (!boolean_ready){
        $("#ilm-start").html("Ready");
        $("#ilm-start").show();
        boolean_ready = true;
      } else if (!boolean_timer) {
        $("#ilm-start").hide();
        $("#ilm-start").html("Timer Set");
        $("#ilm-start").show();
        boolean_timer = true;
      } else if (!boolean_go) {
        $("#ilm-start").hide();
        $("#ilm-start").html("Go!");
        $("#ilm-start").show();
        boolean_go = true;
      } else {
        $("#ilm-start").hide();
        if (!start){
          setInitialTime(10);
        }
        start = true;
      }
    },1500);

    var timer = setInterval(function() {

      var count = parseInt($('#ilm-time-box-value').html());
      if (count !== 0 && !win && start) {
        $('#ilm-time-box-value').html(count - 1);
      } else {
        if (start && boolean_ready && boolean_timer && boolean_go) {
          clearInterval(timer);
          out = true;

          // Show up the popup
          if (!win){
              $('#ilm-modal-box-lose').show();
          }
        }
      }
    }, 1000);
  });
});
