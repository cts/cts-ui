CTS.status.libraryLoaded.then(function() {
  modalDemo();
});


var question2 = function() {
  var modal = new _CTSUI.Modal(CTS.$, CTS.Q, {
    'title': 'A Question',
    'message': 'Do small rocks float on water?',
    'yesno': true
  });

  modal.show().then(
    function() {
      alert("You said yes");
    },
    function() {
      alert("You said no");
    }
  );
};

var modalDemo = function() {

  var modal = new _CTSUI.Modal(CTS.$, CTS.Q, {
    'title': 'A simple alert'
  });

  modal.show().then(
    function(answer) {
      alert("You clicked OK");
      question2();
    },
    function(reason) {
      alert("There was a problem");
    }
  );
};

