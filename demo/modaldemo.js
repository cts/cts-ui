CTS.status.libraryLoaded.then(function() {
  modalDemo();
});

var question1 = function() {
  var modal = new _CTSUI.Modal(CTS.$, CTS.Q);
  var title = "A simple alert";
  modal.alert(title).then(
    function(answer) {
      alert("You clicked OK");
      question2();
    },
    function(reason) {
      alert("There was a problem");
    }
  );
};

var question2 = function() {
  var modal = new _CTSUI.Modal(CTS.$, CTS.Q);
  var title = "A question";
  var body = 'Do small rocks float on water?';

  modal.confirm(title, body).then(
    function() {
      alert("You said yes");
      question3();
    },
    function() {
      alert("You said no");
      question3();
    }
  );
};

var question3 = function() {
  var modal = new _CTSUI.Modal(CTS.$, CTS.Q);
  var body = 'What is your name?';
  modal.prompt(null, body).then(
    function(result) {
      alert("Why hello, " + result);
      question4();
    },
    function() {
      alert("You don't want to tell me?");
      question4();
    }
  );
};

var question4 = function() {
  var modal = new _CTSUI.Modal(CTS.$, CTS.Q);
  var body = 'What is your favorite choice?';
  var choices = [
     'Option A',
     'Option B'
  ];

  modal.select(null, body, choices).then(
    function(result) {
      alert("You picked, " + result);
    },
    function(reason) {
      alert("No selection: " + reason);
    }
  );
};

var modalDemo = function() {
  question1();
};

