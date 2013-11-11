_CTSUI.autoload = function() {
  // Load CK Editor
  var s = document.createElement('script');
  s.setAttribute('src', _CTSUI.URLs.Scripts.ckeditor);
  s.setAttribute('type', 'text/javascript');
  document.getElementsByTagName('head')[0].appendChild(s);

  if (typeof CTS != 'undefined') {
    CTS.UI = _CTSUI;
    CTS.status.defaultTreeReady.then(function() {
      CTS.UI.load();
    });
  } else {
    // CTS isn't present. Let's create it with a script.
    var s = document.createElement('script');
    s.setAttribute('src', _CTSUI.URLs.Scripts.cts);
    s.setAttribute('type', 'text/javascript');
    s.onload = function() {

      CTS.UI = _CTSUI;
      // Now we have to wait for $ to load
      CTS.status.defaultTreeReady.then(function() {
        CTS.engine.booted.then(function() {
          CTS.UI.load();
        });
      });
    };
    document.getElementsByTagName('head')[0].appendChild(s);

    // TODO(Jessica): Inject the editor stuff.
  }
};
_CTSUI.autoload();
