_CTSUI.Editor = function(tray, trayContentsNode) {
  this._tray = tray; // A Javascript object
  this._trayContentsNode = trayContentsNode;
  this._container = null;
  this._node = null;
  this.editing = false;
  this.loadMockup();
};

_CTSUI.Editor.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='cts-ui-page cts-ui-editor-page'></div>");

  var cts = "@html editor " + CTS.UI.Mockups.editor + ";";
  CTS.UI.Util.addCss(CTS.UI.CSS.editor);
  cts += "this :is editor | #cts-ui-editor;";
  this._container.attr("data-cts", cts);
  var self = this;
  this._container.appendTo(this._trayContentsNode);
  this._container.on("cts-received-is", function(evt) {
    self.setupMockup();
    evt.stopPropagation();
  });

};

_CTSUI.Editor.prototype.setupMockup = function() {
 // var whatever = this._node.height();
 // this._node.height(whatever);

  this._node = this._container.find('.cts-ui-editor');
  this._editBtn = this._node.find('.cts-ui-edit-btn');
  console.log("Setup mockup called", this._editBtn);
  this._duplicateBtn = this._node.find('.cts-ui-duplicate-btn');
  this._loginBtn = this._node.find('.cts-ui-login-btn');
  this._logoutBtn = this._node.find('.cts-ui-logout-btn');
  var self = this;

  /* Note: picker-related events have to stop propagation.  Otherwise the
   * picker will load and catch the same mouseup event that initiated it in the
   * first place!
   */
  this._editBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    self.editClicked();
  });

  this._duplicateBtn.on('click', function(e) {
    console.log("Duplicate Btn!");
    self.duplicateClicked();
  });

  this._loginBtn.on('click', function(e) {
    console.log("Login Btn!");
    self.loginClicked();
  });

  this._logoutBtn.on('click', function(e) {
    console.log("Logout Btn!");
    self.logoutClicked();
  });

};

/* LOGIN
 * ====================================================================
 */

_CTSUI.Editor.prototype.loginClicked = function() {
  this._node = this._container.find('.cts-ui-editor');
  this._userField = this._node.find('.cts-ui-username-field');
  this._passField = this._node.find('.cts-ui-password-field');
  this._loginBtn = this._node.find('.cts-ui-login-btn');
  this._logoutBtn = this._node.find('.cts-ui-logout-btn');
  console.log("Login clicked");
  // post to CTS-server
  CTS.$.post(
    'localhost:8888/login',
    {
      form: {
        username: this._userField.val(),
        password: this._passField.val()
      }
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        // add cookie
        docCookies.setItem('cts-session',body.sessionId);
        // remove login form
        this._loginBtn.hide();
        this._userField.hide();
        this._passField.hide();
        // replace with username and logout button
        this._logoutBtn.show();
      }
      else{
        console.log('Login failed');
      }
    }
  );
};

/* LOGOUT
 * ====================================================================
 */

_CTSUI.Editor.prototype.logoutClicked = function() {
  this._node = this._container.find('.cts-ui-editor');
  this._userField = this._node.find('.cts-ui-username-field');
  this._passField = this._node.find('.cts-ui-password-field');
  this._loginBtn = this._node.find('.cts-ui-login-btn');
  this._logoutBtn = this._node.find('.cts-ui-logout-btn');

  console.log("Logout clicked");
  // remove cookie
  docCookies.removeItem('cts-session');
  // replace with username and logout button
  this._userField.show();
  this._passField.show();
  this._loginBtn.show();
  this._logoutBtn.hide();
};

/* DUPLICATE
 * ====================================================================
 */

_CTSUI.Editor.prototype.duplicateClicked = function() {
  // Hit the CTS server with a request to duplicate this page, and then redirect.
  this.duplicateFailed("Not yet implemented!");
};

_CTSUI.Editor.prototype.duplicateSuccess = function(urlOfDuplicate) {
  window.location.replace(urlOfDuplicate);
};

_CTSUI.Editor.prototype.duplicateFailed = function(reason) {
  var body = "<p><b>Terribly sorry, but I wasn't able to duplicate the page.</b></p>" +
    "<p>The error message my code generated was:</p><br />" +
    "<p>" + reason + "</p>";
  CTS.UI.modal.alert("Oops...", body).then(function() {}, function() {});
};

/* EDIT
 * ====================================================================
 */

_CTSUI.Editor.prototype.editClicked = function() {
  console.log("Edit clicked");
  var pickPromise = CTS.UI.picker.pick({
    ignoreCTSUI: true
  });
  var self = this;

  pickPromise.then(
    function(element) {
      self.beginEdit(element);
    },
    function(errorReason) {
      console.log("Edit canceled: ", errorReason);
    }
  );
};

_CTSUI.Editor.prototype.beginEdit = function($e) {
  // TODO: Jessica
};

_CTSUI.Editor.prototype.cancelEdit = function($e) {
  // TODO: Jessica
};

_CTSUI.Editor.prototype.completeEdit = function($e) {
  // TODO: Jessica
};


_CTSUI.Editor.prototype.updateSize = function(height) {
  if (typeof this._container != undefined) {
    this._container.height(height);
  }

};

_CTSUI.Editor.prototype.triggerSave = function(content) {
    this.saveDialog = new CTS.UI.SaveDialog(content);
}
