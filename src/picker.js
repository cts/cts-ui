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
    'UI': {
      'BorderThickness': 2,
      'BorderPadding': 5,
      'OptionOnly': {
        'border': '2px solid red',
        'background': 'rgba(255, 0, 0, 0.3)',
        'text': ''
      },
      'Offer': {
        'border': '2px solid blue',
        'background': 'rgba(0, 0, 255, 0.3)',
        'text': 'Click to Edit'
      },
      'NoOffer': {
        'border': 'none',
        'background': 'transparent',
        'text': ''
      }

    }
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
  this._$ui = this._$('<div id="' + this.CONST.UI_ID + '" class="cts-ignore"></div>');
  this._$ui.css({
    display: 'none',
    position: 'absolute',
    zIndex: 60000,
    background: this.CONST.UI.Offer.background,
    border: this.CONST.UI.Offer.border
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
  this._$(document)
    .on('keydown', this.CALLBACK.keydown)
    .on('keyup', this.CALLBACK.keyup)
    .on('mousemove', this.CALLBACK.mousemove)
    .on('click', this.CALLBACK.click);

  var h1 = this._$('body').html();
  this._$('body').append(this._$ui);
  var h2 = this._$('body').html();
};

_CTSUI.Picker.prototype._destroyUI = function() {
  this._$(document)
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

  var offerElementSelection = this._canSelect($elem);
  var offerElementOptions = this._canOfferOptions($elem);
  var bodyPos = this._$('body').position();

  var newCss = {
    position: 'absolute',
    left: ($elem.offset().left - bodyPos.left - this.CONST.UI.BorderPadding) + 'px',
    top: ($elem.offset().top - bodyPos.top - this.CONST.UI.BorderPadding) + 'px',
    width: ($elem.outerWidth() - (this.CONST.UI.BorderThickness * 2) + (2 * this.CONST.UI.BorderPadding)) + 'px',
    height: ($elem.outerHeight() - (this.CONST.UI.BorderThickness * 2) + (2 * this.CONST.UI.BorderPadding)) + 'px'
  };

  if (offerElementSelection) {
    newCss['background'] = this.CONST.UI.Offer.background;
    newCss['broder'] = this.CONST.UI.Offer.border;
  } else if ((!offerElementSelection) && (offerElementOptions)) {
    newCss['background'] = this.CONST.UI.OptionOnly.background;
    newCss['broder'] = this.CONST.UI.OptionOnly.border;
  } else {
    newCss['background'] = this.CONST.UI.NoOffer.background;
    newCss['broder'] = this.CONST.UI.NoOffer.border;
  }
  console.log(newCss);
  console.log($elem);
  this._$ui.css(newCss);

  if (offerElementOptions) {
  } else {
  }

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
  if (this._canSelect(this._$selected)) {
    this._complete(this._$selected);
    this._swallowEvent(event);
  }
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
 *   cts-enumerated: Only permit editing cts-enumerated nodes
 * 
 */
_CTSUI.Picker.prototype._canSelect = function($e) {

  if (!('restrict' in this._currentOpts)) {
    return true;
  }

  var restriction = this._currentOpts.restrict;
  var passesRestriction = true;

  if (restriction == 'text') {
    passesRestriction = ($e.children().length == 0);
  } else if (restriction == 'css') {
    if ('restrict-class' in this._currentOpts) {
      passesRestriction = $e.hasClass(this._currentOpts['restrict-class']);
    }
  } else if ((restriction == 'cts-value') || (restriction == 'cts-enumerated')) {
    var body = CTS.engine.forrest.trees.body;
    var $$node = body.getCtsNode($e);
    if ($$node == null) {
      passesRestriction = false;
    } else {
      if (restriction == 'cts-value') { 
        passesRestriction = $$node.hasRule('is');
      } else if (restriction == 'cts-enumerated') {
        passesRestriction = $$node.isEnumerated();
      }
    }
  }

  var passesIgnore = true;
  if (('ignoreCTSUI' in this._currentOpts) && (this._currentOpts.ignoreCTSUI)) {
    if ($e.is(CTS.UI.tray._container) || (CTS.UI.tray._container.find($e).length)) {
      passesIgnore = false;
    } else {
      console.log(CTS.UI.tray._container.find($e), $e);
      passesIgnore = true;
    }
  }

  console.log(passesRestriction, passesIgnore);

  var passes = (passesRestriction && passesIgnore);
  console.log(passes);
  return passes;
};


_CTSUI.Picker.prototype._canOfferOptions = function($e) {
  return false;
};

_CTSUI.Picker.prototype._swallowEvent = function(e) {
  e.preventDefault();
  e.stopPropagation();
};
