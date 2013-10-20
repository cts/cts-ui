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
    'UI_ID': 'cts-ui-picker-chrome',
    'UI_BORDER': 1
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
    border: this.CONST.UI_BORDER + 'px solid red'
  });

  // Options for the current picking action
  this._currentOpts = {};

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
  this._currentOpts = opts || {};

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
    this._currentOpts = {};
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
    width: ($elem.outerWidth() - (this.CONST.UI_BORDER * 2)) + 'px',
    height: ($elem.outerHeight() - (this.CONST.UI_BORDER * 2)) + 'px',
    left: $elem.offset().left + 'px',
    top: $elem.offset().top + 'px'
  };

  this._$ui.css(newCss);
  this._$ui.show();
  this._$selected = $elem;
}

/*
 * Clears current selection.
 */
_CTSUI.Picker.prototype._deselect = function() {
  this._$selected = null;
  this._$ui.hide();
};

/*
 * Listeners
 *-----------------------------------------------------*/

_CTSUI.Picker.prototype._keyDown = function(event) {
  if (this._isKeyDown) {
    // Browser repeats keydown while key is depressed..
    return;
  }
  this._isKeyDown = true;
  var candidate = null;

  var firstChild = function($e) {
    var kids = $e.children();
    var toSelect = null;
    if (kids.length > 0) {
      toSelect = this._$(kids[0]);
    }
    return toSelect;
  };

  switch (event.which) {
    case this.CONST.PREV:
      candidate = this._$selected.prev();
      while ((candidate.length > 0) && (! this._canSelect(candidate)) && (this._canSelect(candidate))) {
        candidate = candidate.prev();
      }
      if ((candidate != null) && (candidate.length > 0)) {
        this._select(candidate);
      }
      break;
    case this.CONST.NEXT:
      candidate = this._$selected.next();
      while ((candidate.length > 0) && (! this._canSelect(candidate))) {
        candidate = candidate.next();
      }
      if ((candidate != null) && (candidate.length > 0) && (this._canSelect(candidate))) {
        this._select(candidate);
      }
      break;
    case this.CONST.PARENT:
      candidate = this._$selected.parent();
      while ((candidate.length > 0) && (candidate[0] != document.body) && (! this._canSelect(candidate))) {
        candidate = candidate.parent();
      }
      if ((candidate.length > 0) && (this._canSelect(candidate))) {
        this._select(candidate);
      }
      break;
    case this.CONST.CHILD:
      candidate = firstChild(this._$selected);
      while ((candidate != null) && (! this._canSelect(candidate))) {
        candidate = firstChild(candidate);
      }
      if ((candidate != null) && (this._canSelect(candidate))) {
        this._select(toSelect);
      }
      break;
    case this.CONST.SELECT:
      this._complete();
      break;
    case this.CONST.QUIT:
      this.cancel("Pressed Esc");
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

  $element = this._$(element);
  
  if (this._canSelect($element)) {
    this._select($element);
  } else {
    while (($element.length > 0) && ($element[0] != document.body) && (! this._canSelect($element))) {
      $element = $element.parent();
    }
    if (this._canSelect($element)) {
      this._select($element);
    } else {
      this._deselect();
    }
  }
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
    this._currentOpts = {};
  }
};

/*
 * Utility methods (General)
 *-----------------------------------------------------*/

/**
 * Returns whether the picker is able to select the jQuery element $e
 * according to the 'restrict' mode in the current options.
 *
 * Valid modes:
 *   text: Only permit editing childless nodes
 *   css: Only permit editing nodes with calss `css-class`
 *
 * Planned modes:
 *   cts-value: Only permit editing cts-value nodes
 * 
 */
_CTSUI.Picker.prototype._canSelect = function($e) {
  if ('restrict' in this._currentOpts) {
    if (this._currentOpts.restrict == 'text') {
      return ($e.children().length == 0)
    } else if (this._currentOpts.restrict == 'css') {
      if ('restrict-class' in this._currentOpts) {
        return $e.hasClass(this._currentOpts['restrict-class']);
      }
    } else {
      return true;
    }
  } else {
    return true;
  }
};

_CTSUI.Picker.prototype._swallowEvent = function(e) {
  e.preventDefault();
  e.stopPropagation();
};
