_CTSUI.Tray = function() {
  console.log("Tray Loading");

  this._bodyNode = CTS.$('body');
  this._bodyNode.css({"position": "relative", "overflow-x": "scroll", "left": "301px"});
  this._originalBodyMargin = this._bodyNode.css("margin-left");
  //alert(this._originalBodyMargin);

  // Pages inside the tray, such as the theminator
  this._pages = [];

  // The container DIV which contains the CTS to load the HTML impl.
  this._container = null;

  // The node representing the tray body, loaded by CTS.
  this._node = null;

  this.loadMockup();
};

_CTSUI.Tray.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='cts-ui'></div>");
  var cts = "@html tray " + CTS.UI.Mockups.tray + ";";
  CTS.UI.Util.addCss(CTS.UI.CSS.tray);
  cts += "this :is tray | #cts-ui-tray;";
  this._container.attr("data-cts", cts);
  var self = this;
  this._container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
  this._container.appendTo(this._bodyNode);
};

_CTSUI.Tray.prototype.setupMockup = function() {
  console.log("setup mockup");
  var self = this;
  this._node = this._container.find('.cts-ui-tray');
  this._trayContentsNode = this._container.find('.cts-ui-tray-contents');
    // Create the theminator
  //this._editor = new CTS.UI.Editor(this, this._trayContentsNode);
  this._theminator = new CTS.UI.Theminator(this, this._trayContentsNode);
  this._pages.push(this._theminator);
  //this._pages.push(this._editor);
  this.updateSize();
  CTS.$(window).resize(function() {
    self.updateSize();
  });
  this._node.find('.cts-ui-expand-tray-button').on('click', function() {
    self.toggle();
  });


};

_CTSUI.Tray.prototype.open = function() {
    //var fromTop = CTS.$(window).scrollTop();
  this._node.animate({"left":"0px"});
    //CTS.$(window).scrollTop(fromTop);
  this._bodyNode.animate({"left":"301px"});
  
};

_CTSUI.Tray.prototype.close = function() {
    //var fromTop = CTS.$(window).scrollTop();
  this._node.animate({"left":"-301px"});
    //CTS.$(window).scrollTop(fromTop);
  this._bodyNode.animate({"left":"0px"});

};

_CTSUI.Tray.prototype.toggle = function() {
  console.log("toggle");
  if (this._node.hasClass("cts-ui-open")) {
    this.close();
    this._node.removeClass("cts-ui-open");
    this._node.addClass("cts-ui-closed");
  } else if (this._node.hasClass("cts-ui-closed")) {
    this.open();
    this._node.removeClass("cts-ui-closed");
    this._node.addClass("cts-ui-open");
  } 
};

_CTSUI.Tray.prototype.updateSize = function() {
  // Set the height of the tray to the window size
  var windowHeight = CTS.$(window).height();
  console.log("New window height:", windowHeight);
  this._node.height(windowHeight);
  for (var i = 0; i < this._pages.length; i++) {
    this._pages[i].updateSize(windowHeight);
  }
};
