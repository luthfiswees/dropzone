// Set winning and out condition to false
var win = false;
var out = false;

// Set counter for both conditions
var left_validator  = false;
var center_counter  = 0;
var right_validator = false;

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '.box-draggable',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:
  // Counter for counting box

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
        'stage' : '8'
      },
      success: function(msg){
        console.log("nice");
      }
    });

    // feedback the possibility of a drop
    if (event.relatedTarget.id == 'box-1'){
      dropzoneElement.classList.add('drop-target');
      left_validator = true;
    } else if (event.relatedTarget.id == 'box-2' || event.relatedTarget.id == 'box-3') {
      dropzoneElement.classList.add('drop-target');
      center_counter += 1;
    } else if (event.relatedTarget.id == 'box-4'){
      dropzoneElement.classList.add('drop-target');
      right_validator = true;
    } else {
      dropzoneElement.classList.add('not-drop-target');
    }
    draggableElement.classList.add('can-drop');
  },
  ondragleave: function (event) {
    $.ajax({
      type: 'POST',
      url: '/api/record_action',
      data: {
        'action': 'drag box away from dropzone', // This is the name of the action
        'stage' : '8'
      },
      success: function(msg){
        console.log("nice");
      }
    });

    // remove the drop feedback style
    if (event.relatedTarget.id == 'box-1'){
      event.target.classList.remove('drop-target');
      left_validator = false;
    } else if (event.relatedTarget.id == 'box-2' || event.relatedTarget.id == 'box-3') {
      dropzoneElement.classList.add('drop-target');
      center_counter -= 1;
    } else if (event.relatedTarget.id == 'box-1'){
      event.target.classList.remove('drop-target');
      right_validator = false;
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
        'stage' : '8'
      },
      success: function(msg){
        console.log("nice");
      }
    });

    if (event.relatedTarget.id == 'box-1' || event.relatedTarget.id == 'box-2' || event.relatedTarget.id == 'box-3' || event.relatedTarget.id == 'box-4'){
      // Change text
      event.relatedTarget.textContent = 'Right';

      if (left_validator || center_counter >= 2 || right_validator) {
        // display popup
        var modal = document.getElementById('ilm-modal-box');
        win = true;
        modal.style.display = "block";
      }
    } else {
      event.relatedTarget.textContent = "Wrong";
    }
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    if (event.relatedTarget.id == 'box-1' || event.relatedTarget.id == 'box-2'){
      event.target.classList.remove('drop-target');
    } else {
      event.target.classList.remove('not-drop-target');
    }
  }
});
