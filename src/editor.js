_CTSUI.Editor = function(tray, trayContentsNode) {
  this._tray = tray; // A Javascript object
  this._trayContentsNode = trayContentsNode;
  this._container = null;
  this._node = null;
  this.editing = false;
  this.loadMockup();
};

_CTSUI.Editor.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='cts-ui-page cts-ui-editor-page'></div>");
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
  this.editor = this._container.find('.cts-ui-editor');
  this.editor.find('.cts-ui-save-btn').on('click', CTS.$.proxy(this.toggleSave, this));
  this.editor.find('.cts-ui-trigger-btn').on('click', CTS.$.proxy(this.triggerSave, this));
};

_CTSUI.Editor.prototype.toggleSave = function(saveButton) {
    if (saveButton.hasClass("active")) {
        this.editing = false;
        saveButton.removeClass("active");
    } else {
        this.editing = true;
        saveButton.addClass("active");
    }
};

_CTSUI.Editor.prototype.triggerSave = function(content) {
    this.saveDialog = new CTS.UI.SaveDialog(content);
}
