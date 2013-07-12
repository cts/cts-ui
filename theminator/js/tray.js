if (typeof CTS == 'undefined') {
  CTS = {};
}
CTS.$ = jQuery;
if (typeof CTS.UI == 'undefined') {
  CTS.UI = {};
}

CTS.UI.Tray = function() {
  // XXX Temporary Cheat!
  this.createInPage();
  this._theminatorNode = CTS.$('.theminator');
  this._theminator = new CTS.UI.Theminator(this._node, this._theminatorNode);
  this.updateSize();
};

CTS.UI.Tray.prototype.createInPage = function() {
  this._node = $('.tray');
  console.log("Hi, I'm Tray, and my node is: ", this._node);
  var self = this;
  CTS.$(window).resize(function() {
    self.updateSize();
  });
};

CTS.UI.Tray.prototype.open = function() {
  this._node.css("left", "0px");
};

CTS.UI.Tray.prototype.close = function() {
  this._node.css("left", "-300px");
};

CTS.UI.Tray.prototype.updateSize = function() {
  // Set the height of the tray to the window size
  var windowHeight = CTS.$(window).height();
  console.log("New window height:", windowHeight);
  this._node.height(windowHeight);
  this._theminator.updateSize();
};

// XXX Temporary Cheat!
$(function() {
  window.tray = new CTS.UI.Tray();
});
