_CTSUI.Switchboard = function($, q, opts) {
  this.opts = opts || {};

  if (typeof this.opts.serverUrl == 'undefined') {
    this.opts.serverUrl = _CTSUI.serverBase + _CTSUI.switchboardPath;
  }

  this._q = q;
  this._$ = $;
  this._opQueue = [];
  this._opSending = null;
  this._flushLock = null; // Null or a promise.
  this._flushAgain = null; // Null or a promise
};

_CTSUI.Switchboard.prototype.saveOperation = function(operation) {
  this._operationQueue.push(operation);
  return this._maybeFlush();
};

_CTSUI.Switchboard.prototype.flush = function(operation, cb) {
  if (this._flushLock != null) {
    // A flush is already in progress. 
    // So we'll return a promise for the *next* flush.
    if (this._flushAgain == null) {
      this._flushAgain = this._q.defer();
    }
    return this._flushAgain.promise;
  } else {
    // No flush is in progress, so we'll perform one and return the promise to
    // finish it.
    this._flushLock = this._q.defer);
    var opsToSend = this._operationQueue.slice(0); // Clone the array
    this._doFlush();
    return this._flushLock.promise;
  }
};

_CTSUI.Switchboard.prototype._flushComplete = function(success, msg, jqXHR, textStatus) {
  // Rotate all the locks.
  var oldLock = this._flushLock;
  this._flushLock = this._flushAgain;
  this._flushAgain = null;

  // Now before we do anything, curate the queued operations.
  // If success, prune the ones send. Else, do nothing.
  if (success) {
    this._opQueue = this._opQueue.slice(this._opSending.length);
    // TODO: Have a promise on each operation?
    this._opSending = null;
    oldLock.resolve();
  } else {
    this._opSending = null;
    oldLock.reject();
  }

  // If other flushes were pending, do them now.
  if (this._flushLock != null) {
    this._doFlush();
  }
};

_CTSUI.Switchboard.prototype._doFlush = function() {
  var self = this;
  this._$.ajax({
    type: "POST",
    url: this.opts.serverUrl,
  }).done(function(message) {
    self._flushComplete(true, message, null, null);
  }).fail(function(jqXHR, textStatus) {
    self._flushComplete(false, null, jqXHR, textStatus);
  });
};

_CTSUI.Switchboard.prototype._maybeFlush = function() {
  // TODO: It would be nice to pool multiple operations together.
  return this.flush();
};
