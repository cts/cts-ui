// This is only to be run once we're sure CTS is present.
// (see autoloader.js)
_CTSUI.load = function() {
  CTS.$(function() {
    CTS.UI.clipboard = new CTS.UI.Clipboard();
    CTS.UI.tray = new CTS.UI.Tray();
  });
};
