_CTSUI.Util = {
  addCss: function(url) {
    var link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', url);
    document.getElementsByTagName('head')[0].appendChild(link);
  },

  uniqueSelectorFor: function($e) {
    return null;
  }
};
