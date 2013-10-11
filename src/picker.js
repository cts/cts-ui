/**
 * Element Picker.
 *
 * Args:
 *  $ - jQuery (can be found at CTS.$ once CTS loads)
 *  q - The Q library (can be found at CTS.Q once CTS loads)
 */
_CTSUI.Picker = function($, q) {
  this._$ = $;
  this._q = q;

  // The promise for picking. Only one pick action possible at a time.
  this._deferred = null;

  // For rate-limiting mousemove responses
  this._lastTime = new Date();

  // For rate-limiting keypress responses
  this._isKeyDown = false;

  // Various magic numbers
  this.CONST = {
    'PREV': 37, // Left
    'NEXT': 39, // Right
    'CHILD': 40, // Down
    'PARENT': 38, // Up
    'SELECT': 13, // Enter
    'QUIT': 27, // Esc
    'MOUSE_MOVEMENT_GRANULARITY': 25, // Millisec
    'UI_ID': 'cts-ui-picker-chrome'
  };

  // This dictionary stores a copy of these methods with the scope
  // hard wired so that the `this` pointer will address this object
  // instance.
  this.CALLBACK = {
    'keydown': this._$.proxy(this._keyDown, this),
    'keyup': this._$.proxy(this._keyUp, this),
    'mousemove': this._$.proxy(this._mouseMove, this),
    'click': this._$.proxy(this._click, this)
  };

  // The element currently under focus of the picker.
  this._$selected = null;

  // The visual representation of the picker focus in the DOM
  this._$ui = this._$('<div id="' + this.CONST.UI_ID + '"></div>');
  this._$ui.css({
    display: 'none',
    position: 'absolute',
    zIndex: 65000,
    background: 'rgba(255, 0, 0, 0.3)',
    border: '1px solid red'
  });

};

/*
 * Public methods
 *-----------------------------------------------------*/

/*
 * Returns boolean: whether the picker is active.
 */
_CTSUI.Picker.prototype.isPickInProgress = function() {
  return (this._deferred != null);
};

/**
 * Returns a promise to pick something.
 */
_CTSUI.Picker.prototype.pick = function(opts) {
  if (this.isPickInProgress()) {
    this.cancel("New pick initiated.");
  }
  this._deferred = this._q.defer();
  this._constructUI();
  return this._deferred.promise;
};

/*
 * Cancel the current picking action.
 */
_CTSUI.Picker.prototype.cancel = function(reason) {
  if (this.isPickInProgress()) {
    this._destroyUI();
    this._deferred.reject(reason);
    this._deferred = null;
    this._$selected = null
  }
};

/*
 * User interface
 *-----------------------------------------------------*/

_CTSUI.Picker.prototype._constructUI = function() {
  this._$('body')
    .on('keydown', this.CALLBACK.keydown)
    .on('keyup', this.CALLBACK.keyup)
    .on('mousemove', this.CALLBACK.mousemove)
    .on('click', this.CALLBACK.click);

  this._$('body').append(this._$ui);
};

_CTSUI.Picker.prototype._destroyUI = function() {
  this._$('body')
    .off('keydown', this.CALLBACK.keydown)
    .off('keyup', this.CALLBACK.keyup)
    .off('mousemove', this.CALLBACK.mousemove)
    .off('click', this.CALLBACK.click);

  this._$ui.remove();
};

/*
 * Args:
 *  $elem - jQuery object
 */
_CTSUI.Picker.prototype._select = function($elem) {
  // Behavior on empty selection: nothing
  if ((typeof $elem == 'undefined') || ($elem == null) || ($elem.length == 0)) {
    return;
  }

  // If the selected element is already this, do nothing.
  if ($elem == this._$selected) {
    return;
  }

  var newCss = {
    position: 'absolute',
    width: ($elem.outerWidth() - 1) + 'px',
    height: ($elem.outerHeight() - 1) + 'px',
    left: $elem.offset().left + 'px',
    top: $elem.offset().top + 'px'
  };

  this._$ui.css(newCss);
  this._$ui.show();
  this._$selected = $elem;
}

/*
 * Listeners
 *-----------------------------------------------------*/

_CTSUI.Picker.prototype._keyDown = function(event) {
  if (this._isKeyDown) {
    // Browser repeats keydown while key is depressed..
    return;
  }
  this._isKeyDown = true;
  switch (event.which) {
    case this.CONST.PREV:
      this._select(this._$selected.prev());
      break;
    case this.CONST.NEXT:
      this._select(this._$selected.next());
      break;
    case this.CONST.PARENT:
      this._select(this._$selected.parent());
      break;
    case this.CONST.CHILD:
      var kids = this._$selected.children();
      var toSelect = null;
      if (kids.length > 0) {
        toSelect = this._$(kids[0]);
      }
      this._select(toSelect);
      break;
    case this.CONST.SELECT:
      this._complete();
      break;
    case this.CONST.QUIT:
      this._cancel("Pressed Esc");
      break;
  }
  this._swallowEvent(event);
};

_CTSUI.Picker.prototype._keyUp = function(event) {
  this._isKeyDown = false;
};

_CTSUI.Picker.prototype._mouseMove = function(event) {
  // Don't be too hyper about tracking mouse movements.
  var now = new Date();
  if (now - this._lastTime < this.CONST.MOUSE_MOVEMENT_GRANULARITY) {
    return;
  }
  this._lastTime = now;

  var element = event.target;

  if (element == document.body) {
    // Selecting the document body is silly.
    return;
  } else if (element.id == this.CONST.UI_ID) {
    // We've selected our own user interface element! Need to
    // figure out what is beneath by momentarily hiding the UI.
    this._$ui.hide();
    element = document.elementFromPoint(event.clientX, event.clientY);
  }

  element = this._$(element);
  this._select(element);
};

_CTSUI.Picker.prototype._click = function(event) {
  this._complete(this._$selected);
  this._swallowEvent(event);
};

/*
 * Completes the current pick.
 */
_CTSUI.Picker.prototype._complete= function(reason) {
  this._destroyUI();
  if (this._deferred != null) {
    this._deferred.resolve(this._$selected);
    this._deferred = null;
    this._$selected = null;
  }
};

/*
 * Utility methods (General)
 *-----------------------------------------------------*/

_CTSUI.Picker.prototype._swallowEvent = function(e) {
  e.preventDefault();
  e.stopPropagation();
};



