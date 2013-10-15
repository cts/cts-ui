CTS.status.libraryLoaded.then(function() {
  modalDemo();
});

var modalDemo = function() {

  var modal = new _CTSUI.Modal(CTS.$, CTS.Q);
  var promise = modal.show();

  promise.then(
    function(element) {
      alert("You said OK");
    },
    function(reason) {
      alert("There was a problem");
    }
  );

};



