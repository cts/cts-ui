CTS.status.libraryLoaded.then(function() {
  _CTSUI.picker = new _CTSUI.Picker(CTS.$, CTS.Q);
  pickerDemo();
});


var demo1 = function() {
  alert("Try selecting any node");
  _CTSUI.picker.pick().then(
    function(element) {
      alert("You picked an element: " + element.html());
      demo2();
    },
    function(reason) {
      alert("You canceled the picking: " + reason);
      demo2();
    }
  );
};

var demo2 = function() {
  alert("You can only select text nodes now.");
  _CTSUI.picker.pick({
    'restrict': 'text'
  }).then(
    function(element) {
      alert("You picked an element: " + element.html());
      demo3();
    },
    function(reason) {
      alert("You canceled the picking: " + reason);
      demo3();
    }
  );
};

var demo3 = function() {
  alert("You can only select nodes with class 'main_link' now.");
  _CTSUI.picker.pick({
    'restrict': 'css',
    'restrict-class': 'main_link'
  }).then(
    function(element) {
      alert("You picked an element: " + element.html());
    },
    function(reason) {
      alert("You canceled the picking: " + reason);
    }
  );
}

var pickerDemo = function() {
  demo1();
};


