CTS.status.libraryLoaded.then(function() {
  pickerDemo();
});

var pickerDemo = function() {

  alert("Select an element with the mouse");

  _CTSUI.picker = new _CTSUI.Picker(CTS.$, CTS.Q);
  CTS.$('body').focus();

  var promise = _CTSUI.picker.pick();

  promise.then(
    function(element) {
      alert("You picked an element: " + element.html());
    },
    function(reason) {
      alert("You canceled the picking: " + reason);
    }
  );

};


