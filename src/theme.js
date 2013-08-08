_CTSUI.Theme = function (theme) {
    console.log("Theme loading");

    this._bodyNode = CTS.$('body');
    this._originalBodyMargin = this._bodyNode.css("margin-left");

    // Pages inside the tray, such as the theminator
    this._pages = [];

    // The container DIV which contains the CTS to load the HTML impl.
    this._container = null;

    // The node representing the tray body, loaded by CTS.
    this._node = null;
    if (typeof theme != "undefined") {
        this.theme = theme;
        this.loadMockup();
    } else {
        this.revert();
    }
};

_CTSUI.Theme.prototype.loadMockup = function () {
    console.log("load mockup")
    console.log(CTS.engine);
    CTS.engine.forrest.removeDependencies();
    CTS.engine.shutdown();
    var specs = [CTS.Parser.parse("@html mockup " + CTS.UI.Blog.Themes[this.theme].Mockup.Index + ";"),
                 CTS.Parser.parse("@html default " + CTS.UI.Blog.Themes[this.theme].Mockup.Default + ";"),
                CTS.Parser.parse("@cts " + CTS.UI.Blog.Themes[this.theme].Cts + ";"),
                CTS.Parser.parse("@cts " + CTS.UI.Blog.Jekyll.Cts.Index + ";")];

    
    CTS.Utilities.fetchString({url: window.location}).then(
      function(page) {
        var pageContents = CTS.$(page).filter("#page").contents();
        CTS.$('#page').empty();
        CTS.$('#page').append(pageContents);
        CTS.$('#page').removeAttr('data-ctsid');
        console.log("BOOTING NEW ENGINE");
        var newEngine = new CTS.Engine({
          autoLoadSpecs: false,
          forrestSpecs: specs,
          forrest: {
            defaultTree: CTS.$('#page')
          }
        });
      console.log("newEngine",newEngine);

        newEngine.boot().then(
            function() {
                console.log("BOOTED!");
                CTS.engine = newEngine;
            }
        );
      },
      function(error) {
          
      }
    );
    
};

_CTSUI.Theme.prototype.revert = function () {
    console.log("revert")
    CTS.engine.forrest.removeDependencies();
    CTS.engine.shutdown();

    
    CTS.Utilities.fetchString({url: window.location}).then(
      function(page) {
        var pageContents = CTS.$(page).filter("#page").contents();
        CTS.$('#page').empty();
        CTS.$('#page').append(pageContents);
        CTS.$('#page').removeAttr('data-ctsid');
        console.log("BOOTING NEW ENGINE");
        var newEngine = new CTS.Engine({
          forrest: {
            defaultTree: CTS.$('#page')
          }
        });
      console.log("newEngine",newEngine);

        newEngine.boot().then(
            function() {
                console.log("BOOTED!");
                CTS.engine = newEngine;
            }
        );
      },
      function(error) {
          
      }
    );
    
};

_CTSUI.Theme.prototype.loadCTSRules = function (file) {
    CTS.$.get(file, function (data) {
        return data;
    });
}

_CTSUI.Theme.prototype.setupMockup = function () {
    console.log("setup mockup");
};