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

  var cts = "@html editor " + CTS.UI.URLs.Mockups.editor + ";";
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.editor);
  cts += "this :is editor | #cts-ui-editor;";
  this._container.attr("data-cts", cts);
  var self = this;
  this._container.appendTo(this._trayContentsNode);
  this._container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
    
};

_CTSUI.Editor.prototype.setupMockup = function() {
 // var whatever = this._node.height();
 // this._node.height(whatever);

  this._node = this._container.find('.cts-ui-editor');
  this._editBtn = this._node.find('.cts-ui-edit-btn');
  this._duplicateBtn = this._node.find('.cts-ui-duplicate-btn');
  this._saveBtn = this._node.find('.cts-ui-save-btn');

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
    self.duplicateClicked();
  });

  this._saveBtn.on('click', function(e) {
    self.saveClicked();
  });

};


/* SAVE
 * ====================================================================
 */

var DOWNLOAD_ZIP = "Download Complete Page";
var SAVE_TO_WEB = "Save to web";

_CTSUI.Editor.prototype.saveClicked = function() {
  // Hit the CTS server with a request to duplicate this page, and then redirect.
  var title = "Save your Changes";
  var body = "How do you want to save?";
  var options = [DOWNLOAD_ZIP, SAVE_TO_WEB];
  CTS.UI.modal.select(title, body, options).then(
    this.saveChoiceMade,
    function() {
      console.log("Save canceled.");
    });
};

/**
 * Applies any pending changes to the HTML and provides a link to
 * download the modified page as source.
 *
 * See cts-server/app/models/operation.js for operation definition.
 */
_CTSUI.Editor.prototype.saveChoiceMade = function(choice) {
  if ((choice != DOWNLOAD_ZIP) && (choice != SAVE_TO_WEB)) {
    console.log("Unknown save choice: " + choice);
    return;
  }

  if (choice == DOWNLOAD_ZIP) {
  } else if (choice == SAVE_TO_WEB) {
    CTS.UI.switchboard.flush().then(
      function(operation) {
       CTS.UI.modal.alert("Page Saved", "<p><a href='" + url + "'>Download your Page</a></p>");
      }, function(errMessage) {
        CTS.UI.modal.alert("Could not save", errMessage);
      }
    );
  }

  CTS.UI.switchboard.recordOperation(operation).then(
    function(operation) {

      //TODO: This is a hack. Figure out unified way to handle resources IDs.
      var key = operation.result.url;
      var url = _CTSUI.serverBase + 'tree/' + key;
    },
    function(errorMesage) {
    }
  );
};

_CTSUI.Editor.prototype.saveZipResponse = function(choice) {
};

_CTSUI.Editor.prototype.saveToWebResponse = function(choice) {
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
 *   - editClicked
 *   - beginEdit
 *   - cancelEdit
 *   - completeEdit
 *
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
  // 1. Stash away the content of the old node.
  this._$editNode= $e;
  this._editBefore = $e.html();
};

_CTSUI.Editor.prototype.cancelEdit = function($e) {
  $_$editNode.html(this._editBefore);
  this._editBefore = null;
  this._$editNode = null
};

_CTSUI.Editor.prototype.completeEdit = function($e) {
  // Need to find a unique way to identify $e.
  var selector = CTS.UI.Util.uniqueSelectorFor($e);
  var content = $e.html();
  var operation = {
    treeUrl: window.location.href,
    treeType: 'html',
    action: 'edit',
    parameters: {
      selector: selector,
      content: content
    }
  };

  // Flush the queue of pending edit operations.
  CTS.UI.switchboard.recordOperation(operation).then(
    function(operation) {
      console.log("Operation recorded.");
    },
    function(errorMesage) {
      console.log("Error: operation not recorded.");
    }
  );
};


/* CLONE
 *   - cloneClicked
 *   - clone
 *
 * ====================================================================
 */

_CTSUI.Editor.prototype.cloneClicked = function() {
  console.log("Duplicate clicked");
  var pickPromise = CTS.UI.picker.pick({
    ignoreCTSUI: true,
    restrict: 'cts-enumerated'
  });
  var self = this;

  pickPromise.then(
    function(element) {
      self.cloneElement(element);
    },
    function(errorReason) {
      console.log("Duplicate canceled: ", errorReason);
    }
  );
};

_CTSUI.Editor.prototype.cloneElement = function($e) {
  var clone = $e.clone();
  var selector = CTS.UI.uniqueSelectorFor($e);
  clone.insertAfter($e);
  var operation = {
    treeUrl: window.location.href,
    treeType: 'html',
    action: 'clone',
    parameters: {
      selector: selector
    }
  };

  // Flush the queue of pending edit operations.
  CTS.UI.switchboard.recordOperation(operation).then(
    function(operation) {
      console.log("Operation recorded.");
    },
    function(errorMesage) {
      console.log("Error: operation not recorded.");
    }
  );
};

/* DUPLICATE
 *   - duplicateClicked
 *   - duplicate
 *
 * ====================================================================
 */

_CTSUI.Editor.prototype.updateSize = function(height) {
  if (typeof this._container != undefined) {
    this._container.height(height);
  }
};

