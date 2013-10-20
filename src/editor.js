_CTSUI.Editor = function(tray, trayContentsNode) {
  this._tray = tray; // A Javascript object
  this._trayContentsNode = trayContentsNode;
  this.loadMockup();
};

_CTSUI.Editor.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='cts-ui-page cts-ui-editor-page'></div>");
  console.log(CTS.UI.Mockups.editor);
  console.log(CTS.UI.CSS.editor);
  var cts = "@html editor " + CTS.UI.Mockups.editor + ";";
  cts += "@css " + CTS.UI.CSS.editor + ";";
  cts += "this :is editor | #cts-ui-editor;";
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
  this._node = this._container.find('.cts-ui-editor');
  this._editBtn = this._node.find('.cts-ui-edit-btn');
  console.log(this._editBtn);
  this._editBtn.on('click', CTS.$.proxy(this.edit, this));
};

_CTSUI.Editor.prototype.edit = function(evt) {
  console.log("edit");
  // Pick.
  CTS.UI.picker.pick();
};

_CTSUI.Editor.prototype.updateSize = function(height) {
  if (typeof this._container != undefined) {
    this._container.height(height);
  }
};
