// Set winning and out condition to false
var win = false;
var out = false;

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '.box-draggable',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:
  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;
    // Send action to be recorded in backend
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'drag box into dropzone', // This is the name of the action
        'stage' : '1'
      },
      success: function(msg){
        console.log("nice");
      }
    });

    // feedback the possibility of a drop
    if (event.relatedTarget.id == 'box-1'){
      dropzoneElement.classList.add('drop-target');
    } else {
      dropzoneElement.classList.add('not-drop-target');
    }
    draggableElement.classList.add('can-drop');
  },
  ondragleave: function (event) {
    // Send action to be recorded in backend
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'drag box away from dropzone', // This is the name of the action
        'stage' : '1'
      },
      success: function(msg){
        console.log("nice");
      }
    });

    // remove the drop feedback style
    if (event.relatedTarget.id == 'box-1'){
      event.target.classList.remove('drop-target');
    } else {
      event.target.classList.remove('not-drop-target');
    }
    event.relatedTarget.classList.remove('can-drop');
  },
  ondrop: function (event) {
    // Send action to be recorded in backend
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'drop box in dropzone', // This is the name of the action
        'stage' : '1'
      },
      success: function(msg){
        console.log("nice");
      }
    });

    if (event.relatedTarget.id == 'box-1'){
      // display popup
      var modal = document.getElementById('ilm-modal-box');
      win = true;
      modal.style.display = "block";

      // Change text
      event.relatedTarget.textContent = 'Right';
    } else {
      event.relatedTarget.textContent = "Wrong";
    }
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    if (event.relatedTarget.id == 'box-1'){
      event.target.classList.remove('drop-target');
    } else {
      event.target.classList.remove('not-drop-target');
    }
  }
});
