// This is only to be run once we're sure CTS is present.
// (see autoloader.js)
_CTSUI.load = function() {
  console.log("CTS Loaded");
  CTS.$(function() {
    console.log("BODY CTS ID: ", CTS.$('body').attr("data-ctsId"));
    console.log("Adding Clipboard");
    CTS.UI.clipboard = new CTS.UI.Clipboard();
    console.log("Adding Tray");
    CTS.UI.tray = new CTS.UI.Tray();
  });
};
