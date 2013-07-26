_CTSUI.Theminator = function(tray, container) {
  this._tray = tray; // A Javascript object
  this._container = container; // A DOM Node
  this.loadMockup();
};

_CTSUI.Theminator.prototype.createInContainer = function(container, node) {
  this._container = container;
  this._node = node;
  this._templateContainer = this._node.find(".templates-container");
};

_CTSUI.Theminator.loadMockup = function() {
  this._node = CTS.$("<div class='theminator'></div>");
  this._node.attr("data-cts", ":is " + CTS.UI.Mockups.theminator+ ";")
  //this._node.once("cts-is-incoming", this.setupMockup);
  this._node.appendTo(this._container);
};

_CTSUI.Theminator.setupMockup = function() {
};

_CTSUI.Theminator.prototype.updateSize = function() {
 // var whatever = this._node.height();
 // this._node.height(whatever);
};
