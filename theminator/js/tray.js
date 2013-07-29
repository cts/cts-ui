if (typeof CTS == 'undefined') {
  CTS = {};
}
CTS.$ = jQuery;
if (typeof CTS.UI == 'undefined') {
  CTS.UI = {};
}

CTS.UI.Tray = function() {
  // XXX Temporary Cheat!
  this.createInPage();
  this._theminatorNode = CTS.$('.theminator');
  this._bodyNode = CTS.$('body');
  this._theminator = new CTS.UI.Theminator(this._node, this._theminatorNode);
  this._originalBodyMargin = this._bodyNode.css("margin-left");
  this.updateSize();
};

CTS.UI.Tray.prototype.createInPage = function() {
  this._node = CTS.$('.tray'); // Cheating line: in the future, we'll CREATE the HTML for this node.
  var self = this;
  CTS.$(window).resize(function() {
    self.updateSize();
  });
  this._node.find('.expand-tray-button').on('click', function() {
    self.toggle();
  });
};

CTS.UI.Tray.prototype.open = function() {
  this._node.animate({"left":"0px"});
  this._bodyNode.animate({"margin-left":(301+this._originalBodyMargin)});
  
};

CTS.UI.Tray.prototype.close = function() {
  this._node.animate({"left":"-301px"});
  this._bodyNode.animate({"margin-left":this._originalBodyMargin});

};

CTS.UI.Tray.prototype.toggle = function() {
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

CTS.UI.Tray.prototype.updateSize = function() {
  // Set the height of the tray to the window size
  var windowHeight = CTS.$(window).height();
  this._node.height(windowHeight);
  this._theminator.updateSize();
};

// XXX Temporary Cheat!
$(function() {
  window.tray = new CTS.UI.Tray();
});
