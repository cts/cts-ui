_CTSUI.Tray = function() {
  this._bodyNode = CTS.$('body');
  this._originalBodyMargin = this._bodyNode.css("margin-left");

  // Pages inside the tray, such as the theminator
  this._pages = [];

  // The container DIV which contains the CTS to load the HTML impl.
  this._container = null;

  // The node representing the tray body, loaded by CTS.
  this._node = null;

  this.loadMockup();
};

_CTSUI.Tray.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='ctsTrayContainer'></div>");
  var cts = "@html tray " + CTS.UI.Mockups.tray + ";";
  cts += "@css " + CTS.UI.CSS.tray + ";";
  cts += "this :is tray | #tray;";
  this._container.attr("data-cts", cts);
  var self = this;
  this._container.on("cts-received-is", function() {self.setupMockup()});
  this._container.appendTo(this._bodyNode);
};

_CTSUI.Tray.prototype.setupMockup = function() {
  console.log("setup mockup");
  var self = this;
  this._node = this._container.find('.tray');
  this.updateSize();
  CTS.$(window).resize(function() {
    self.updateSize();
  });
  this._node.find('.expand-tray-button').on('click', function() {
    self.toggle();
  });

  // Create the theminator
  //this._theminatorNode = CTS.$('<div class="tray-page theminator-page"></div>');
  //this._theminatorNode.appendTo(this._node.find(".tray-contents"));
  //this._theminator = new CTS.UI.Theminator(this, this._theminatorNode);
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
  console.log("toggle");
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
  for (var i = 0; i < this._pages.length; i++) {
    this._pages[i].updateSize();
  }
};
