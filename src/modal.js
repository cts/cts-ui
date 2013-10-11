/**
 * Modal Dialogue
 *
 * Args:
 *  $ - jQuery (can be found at CTS.$ once CTS loads)
 *  q - The Q library (can be found at CTS.Q once CTS loads)
 *
 * TODO(ted): Args for what to show.
 * Serialize form?
 *
 * opts has the following components:
 *
 * 
 *
 */
_CTSUI.Modal = function($, q, opts) {
  this._$ = $;
  this._q = q;
  this._deferred = null;

  // Default opts
  this._opts = {
    'title': "Question",
    'body': "<p>Do you want to continue?</p>",
    'buttons': [
      {'label': 'OK'}
    ]
  };

  // Override defaults with those passed in.
  if (opt in opts) {
    if (opts.hasOwnProperty(opt)) { // This suppresses prototypal members
      this._opts[opt] = opts[opt];
    }
  }

};

/*
 * Public methods
 *-----------------------------------------------------*/

_CTSUI.Modal.prototype.isActive = function() {
  return (this._deferred != null);
};

_CTSUI.Modal.prototype.show = function() {
  if (this.isActive()) {
    this.cancel();
  }
  this._deferred = this._q.defer();
  this._constructUI();
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
 * User Interface
 *-----------------------------------------------------*/

_CTSUI.Modal.prototype._constructUI = function() {
};

_CTSUI.Modal.prototype._destroyUI = function() {
};


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
