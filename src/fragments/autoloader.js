_CTSUI.autoload = function() {
  if (typeof CTS != 'undefined') {
    CTS.UI = _CTSUI;
    CTS.status.defaultTreeReady.then(function() {
      CTS.UI.load();
    });
  } else {
    // CTS isn't present. Let's create it with a script.
    var s = document.createElement('script');
    s.setAttribute('src', 'http://localhost:9000/release/cts.js');
    s.setAttribute('type', 'text/javascript');
    s.onload = function() {
      CTS.UI = _CTSUI;
      // Now we have to wait for $ to load
      CTS.status.defaultTreeReady.then(function() {
        CTS.UI.load();
      });
    };
    document.getElementsByTagName('head')[0].appendChild(s);
  }
};
_CTSUI.autoload();
