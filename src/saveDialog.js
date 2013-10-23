

_CTSUI.SaveDialog = function(content) {
  this.contentOffset = content.offset();
  this.contentWidth = content.width();
  this.contentHeight = content.height();
  this._bodyNode = CTS.$('body');
  
  this._container = null;

  // The node representing the tray body, loaded by CTS.
  this._node = null;

  this.loadMockup();
};

_CTSUI.SaveDialog.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='cts-ui'></div>");
  var cts = "@html saveDialog " + CTS.UI.Mockups.saveDialog + ";";
  CTS.UI.Util.addCss(CTS.UI.CSS.saveDialog);
  cts += "this :is saveDialog | #cts-ui-saveDialog;";
  this._container.attr("data-cts", cts);
  var self = this;
  this._container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
  this._container.css({top:this.contentHeight+this.contentOffset.top, left:this.content.width+this.contentOffset.top});
  this._container.appendTo(this._bodyNode);
};