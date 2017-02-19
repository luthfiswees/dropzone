// Set winning condition to false
win = false;

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

    // feedback the possibility of a drop
    if (event.relatedTarget.id == 'box-1' || event.relatedTarget.id == 'box-2'){
      dropzoneElement.classList.add('drop-target');
    } else {
      dropzoneElement.classList.add('not-drop-target');
    }
    draggableElement.classList.add('can-drop');
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    if (event.relatedTarget.id == 'box-1' || event.relatedTarget.id == 'box-2'){
      event.target.classList.remove('drop-target');
    } else {
      event.target.classList.remove('not-drop-target');
    }
    event.relatedTarget.classList.remove('can-drop');
  },
  ondrop: function (event) {
    if (event.relatedTarget.id == 'box-1' || event.relatedTarget.id == 'box-2'){
      // Change text
      event.relatedTarget.textContent = 'Right';

      // display popup
      var modal = document.getElementById('ilm-modal-box');
      win = true;
      modal.style.display = "block";
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
