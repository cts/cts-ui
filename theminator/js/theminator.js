if (typeof CTS == 'undefined') {
  CTS = {};
}
CTS.$ = jQuery;
if (typeof CTS.UI == 'undefined') {
  CTS.UI = {};
}

CTS.UI.Theminator = function(container, node) {
  this.createInContainer(container, node);
};

CTS.UI.Theminator.prototype.createInContainer = function(container, node) {
  this._container = container;
  this._node = node;
  this._templateContainer = this._node.find(".templates-container");
};

CTS.UI.Theminator.prototype.updateSize = function() {
  // var whatever = this._node.height();
 // this._node.height(whatever);
};

