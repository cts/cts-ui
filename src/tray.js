_CTSUI.Tray = function() {
  // XXX Temporary Cheat!
  this._bodyNode = CTS.$('body');
  this.loadMockup();
  this._originalBodyMargin = this._bodyNode.css("margin-left");
};

_CTSUI.Tray.prototype.loadMockup = function() {
  this._node = CTS.$("<div class='ctsTrayContainer'></div>");
  this._node.attr("data-cts", ":is " + CTS.UI.Mockups.tray + ";")
  //this._node.once("cts-is-incoming", this.setupMockup);
  this._node.appendTo(this._bodyNode);
};

_CTSUI.Tray.prototype.setupMockup = function() {
  var self = this;
  this.updateSize();
  CTS.$(window).resize(function() {
    self.updateSize();
  });
  this._node.find('.expand-tray-button').on('click', function() {
    self.toggle();
  });

  // Create the theminator
  this._theminatorNode = CTS.$('<div class="tray-page theminator-page"></div>');
  this._theminatorNode.appendTo(this._node.find(".tray-contents"));
  this._theminator = new CTS.UI.Theminator(this, this._theminatorNode);
};

_CTSUI.Tray.prototype.open = function() {
  this._node.animate({"left":"0px"});
  this._bodyNode.animate({"margin-left":(301+this._originalBodyMargin)});
  
};

_CTSUI.Tray.prototype.close = function() {
  this._node.animate({"left":"-301px"});
  this._bodyNode.animate({"margin-left":this._originalBodyMargin});

};

_CTSUI.Tray.prototype.toggle = function() {
  if (this._node.hasClass("open")) {
    this.close();
    this._node.removeClass("open");
    this._node.addClass("closed");
  } else if (this._node.hasClass("closed")) {
    this.open();
    this._node.removeClass("closed");
    this._node.addClass("open");
  } 
};

_CTSUI.Tray.prototype.updateSize = function() {
  // Set the height of the tray to the window size
  var windowHeight = CTS.$(window).height();
  console.log("New window height:", windowHeight);
  this._node.height(windowHeight);
  this._theminator.updateSize();
};
