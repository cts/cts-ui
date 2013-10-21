_CTSUI.Editor = function(tray, trayContentsNode) {
  this._tray = tray; // A Javascript object
  this._trayContentsNode = trayContentsNode;
  this.loadMockup();
};

_CTSUI.Editor.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='cts-ui-page cts-ui-editor-page'></div>");
  var cts = "@html editor " + CTS.UI.Mockups.editor + ";";
  CTS.UI.Util.addCss(CTS.UI.CSS.editor);
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
  this._duplicateBtn = this._node.find('.cts-ui-duplicate-btn');
  var self = this;

  /* Note: picker-related events have to stop propagation.  Otherwise the
   * picker will load and catch the same mouseup event that initiated it in the
   * first place!
   */
  this._editBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    self.duplicateClicked();
  });

  this._duplicateBtn.on('click', function(e) {
    console.log("Duplicate Btn!");
    self.duplicateClicked();
  });

};

/* DUPLICATE
 * ====================================================================
 */

_CTSUI.Editor.prototype.duplicateClicked = function() {
  // Hit the CTS server with a request to duplicate this page, and then redirect.
  this.duplicateFailed("Not yet implemented!");
};

_CTSUI.Editor.prototype.duplicateSuccess = function(urlOfDuplicate) {
  window.location.replace(urlOfDuplicate);
};

_CTSUI.Editor.prototype.duplicateFailed = function(reason) {
  var body = "<p><b>Terribly sorry, but I wasn't able to duplicate the page.</b></p>" +
    "<p>The error message my code generated was:</p><br />" +
    "<p>" + reason + "</p>";
  CTS.UI.modal.alert("Oops...", body).then(function() {}, function() {});
};

/* EDIT
 * ====================================================================
 */

_CTSUI.Editor.prototype.editClicked = function() {
  CTS.UI.picker.pick({
    ignoreCTSUI: true
  });
};

_CTSUI.Editor.prototype.beginEdit = function($e) {
  // TODO: Jessica
};

_CTSUI.Editor.prototype.cancelEdit = function($e) {
  // TODO: Jessica
};

_CTSUI.Editor.prototype.completeEdit = function($e) {
  // TODO: Jessica
};


_CTSUI.Editor.prototype.updateSize = function(height) {
  if (typeof this._container != undefined) {
    this._container.height(height);
  }
};
