_CTSUI.Scraper = function(tray, $page) {
  this._tray = tray; // A Javascript object
  this.$page = $page;
  this.$container = null;
  this.$node = null;

  this.loadMockup();
};

_CTSUI.Theminator.prototype.loadMockup = function() {
  this.$container = CTS.$("<div class='cts-ui-theminator-page'></div>");
  var cts = "@html scraper " + CTS.UI.URLs.Mockups.scraper + ";";
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.scraper);
  cts += "this :is scraper | #cts-ui-scraper;";
  this.$container.attr("data-cts", cts);
  var self = this;
  this.$container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
  this.$container.appendTo(this.$page);
};

_CTSUI.Theminator.prototype.setupMockup = function() {
    var self = this;
    this.$node = this.$container.find('.cts-ui-scraper');
    this.$back.on('click', function() {
      self._tray.popPage();
    });
};

_CTSUI.Theminator.prototype.requestedWidth = function() {
  return 200;
};

_CTSUI.Theminator.prototype.updateSize = function(height) {
    this.$container.height(height);
    this.$themeList.height(height - this.$header.height());
};

