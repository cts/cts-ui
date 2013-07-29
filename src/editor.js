_CTSUI.Editor = function(tray, trayContentsNode) {
  this._tray = tray; // A Javascript object
  this._trayContentsNode = trayContentsNode;
  this._container = null;
  this._node = null;
  this.loadMockup();
};

_CTSUI.Editor.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='page editor-page'></div>");
  var cts = "@html editor " + CTS.UI.Mockups.editor+ ";";
  cts += "@css " + CTS.UI.CSS.editor + ";";
  cts += "this :is editor | #editor;";
  this._container.attr("data-cts", cts);
  var self = this;
  this._container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
  this._container.appendTo(this._trayContentsNode);
};

_CTSUI.Editor.prototype.setupMockup = function() {
 // var whatever = this._node.height();
 // this._node.height(whatever);
  console.log("setup mockup");
  this._node = this._container.find('.ctsui-editor');
};

_CTSUI.Editor.prototype.updateSize = function() {
};
