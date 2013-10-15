/**
 * Modal Dialogue
 *
 * This is currently a light-weight wrapper around a customized version of alertify.js.
 * which has been modified to support asking the user to choose among options. This helps:
 *   1. Provide a layer of encapsulation around third-party UI libraries, and
 *   2. Provide the Q-based deferment method that CTS and CTS-UI use.
 *
 * Dependencies:
 *  lib/alertify.js
 *
 * Args:
 *  $    - jQuery (can be found at CTS.$ once CTS loads)
 *  q    - The Q library (can be found at CTS.Q once CTS loads)
 *  opts - The options for this modal dialogue. This has the components:
 *           title: The  title
 *           body: The message to the user
 *           yesno: (boolean) Whether to display an OK and Cancel option.
 *
 */
_CTSUI.Modal = function($, q, opts) {
  this._$ = $;
  this._q = q;
  this._deferred = null;

  // No defaults.
  this._opts = opts || {};

};

/*
 * Public methods
 *-----------------------------------------------------*/

_CTSUI.Modal.prototype.show = function() {
  this._deferred = this._q.defer();
  var deferred = this._deferred;

  var hasTitle = ('title' in this._opts);
  var hasBody = ('body' in this._opts);
  var yesno = (('yesno' in this._opts) && (this._opts.yesno));
  var hasChoices = ('choices' in this._opts);

  var msg = null;

  if (hasTitle && (! hasBody)) {
    msg = this._opts.title;
  } else if ((! hasTitle) && (hasBody)) {
    msg = this._opts.body;
  } else if (hasTitle && hasBody) {
    msg = "<h2>" + this._opts.title + "</h2><div>" + this._opts.body + "</div>";
  } else {
    msg = "The programmer asked me to tell you something, but didn't tell me what to tell you!";
  }


  if (choices) {
    var choices = {
      'choices': this._opts.choices
    };
    if ('default' in this._opts) {
      choices['default'] = this._opts['default'];
    }
    Alertify.dialog.choose(msg, function(e) {
      // TODO: e doesn't seem to hold proper information
      if (e) {
        deferred.resolve();
      } else {
        deferred.reject();
      }
    }, choices);
  } else if (yesno) {
    Alertify.dialog.confirm(msg, function(e) {
      console.log(e);
      if (e) {
        deferred.resolve();
      } else {
        deferred.reject();
      }
    });
  } else {
    Alertify.dialog.alert(msg, function() {
      deferred.resolve();
    });
  }

  return this._deferred.promise;
};

_CTSUI.Modal.prototype.cancel = function() {
  if (this._deferred != null) {
    this._deferred.reject("Canceled");
    this._deferred = null;
    this._destroyUI();
  }
};

/*
 * Factory
 *-----------------------------------------------------*/

// TODO: Form-based stuff.
_CTSUI.ModalFactory = {
  YesNo: function($, q, title, question) {
    return new _CTSUI.Modal($, q,
        {'title': title,
         'body': '<p>' + question + '</p>',
         'buttons': [
           {'label': 'Yes'},
           {'label': 'No'}
         ]}
    );
  }
};
