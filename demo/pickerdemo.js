CTS.status.libraryLoaded.then(function() {
  alert("Type pickerDemo() into the console to run demo.");
});

var pickerDemo = function() {

  alert("Select an element with the mouse");

  _CTSUI.picker = new _CTSUI.Picker(CTS.$, CTS.Q);

  var promise = _CTSUI.picker.pick();

  promise.then(
    function(element) {
      console.log("You picked an element:", element);
    },
    function(reason) {
      console.log("You canceled the picking", reason);
    }
  );

};


