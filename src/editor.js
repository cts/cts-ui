_CTSUI.Editor = function(tray, $page) {
  this._tray = tray; // A Javascript object

  this.$page = $page;
  this.$container = null;
  this.$node = null;

  this._isEditing = false;
  this._isEditMode = false;
  this._$editNode = null; // Node being edited
  this._editor; // ckeditor
  this._editBefore; // HTML before the edit
  this.loadMockup();

  this.ckEditorConfig = {
    toolbarGroups: [
      { name: 'mode' },
      { name: 'basicstyles' },
      { name: 'links' }
    ],
    extraPlugins: 'sourcedialog',
    removePlugins: 'sourcearea',
    allowedContent: true, // Suppresses content filter.
    codemirror: {
      theme: 'default',
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseTags: true,
      enableSearchTools: true,
      enableCodeFormatting: true,
      autoFormatOnStart: true,
      autoFormatOnModeChange: true,
      autoFormatOnUncomment: true,
      highlightActiveLine: true,
      mode: 'htmlmixed', // Includes css and js
      showSearchButton: true,
      showTrailingSpace: false,
      highlightMatches: true,
      showFormatButton: false,
      showCommentButton: false,
      showUncommentButton: false,
      showAutoCompleteButton: false
    }
  }

  // TODO: Ensure CKEDITOR is available.
  CKEDITOR.on('instanceCreated', this._onCkEditorInstanceCreated);
};

_CTSUI.Editor.prototype.loadMockup = function() {
  this.$container = CTS.$("<div class='cts-ui-editor-page'></div>");

  var cts = "@html editor " + CTS.UI.URLs.Mockups.editor + ";";
  CTS.UI.Util.addCss(CTS.UI.URLs.Styles.editor);
  cts += "this :is editor | #cts-ui-editor;";
  this.$container.attr("data-cts", cts);

  var self = this;
  this.$container.appendTo(this.$page);
  this.$container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
};

_CTSUI.Editor.prototype.setupMockup = function() {
 // var whatever = this.$node.height();
 // this.$node.height(whatever);

  this.$node = this.$container.find('.cts-ui-editor');
  this._editBtn = this.$node.find('.cts-ui-edit-btn');
  this._uploadBtn = this.$node.find('.cts-ui-upload-btn');
  this._downloadBtn = this.$node.find('.cts-ui-download-btn');
  this._duplicateBtn = this.$node.find('.cts-ui-duplicate-btn');
  this._copyBtn = this.$node.find('.cts-ui-copy-btn');
  this._pasteBtn = this.$node.find('.cts-ui-paste-btn');
  this._saveBtn = this.$node.find('.cts-ui-save-btn');
  this._themeBtn = this.$node.find('.cts-ui-theme-btn');
  this._scrapeBtn = this.$node.find('.cts-ui-scrape-btn');

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

  this._uploadBtn.on('click', function(e) {
    self.uploadClicked();
  });

  this._downloadBtn.on('click', function(e) {
    self.downloadClicked();
  });

  this._themeBtn.on('click', function(e) {
    self.themesClicked();
  });

  this._scrapeBtn.on('click', function(e) {
    self.scrapeClicked();
  });

  this._copyBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    self.copyClicked();
  });

  this._pasteBtn.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    self.pasteClicked();
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

//var DOWNLOAD_ZIP = "Download Complete Page";
//var SAVE_TO_WEB = "Save to web";
//
//_CTSUI.Editor.prototype.saveClicked = function() {
//  // Hit the CTS server with a request to duplicate this page, and then redirect.
//  var title = "Save your Changes";
//  var body = "How do you want to save?";
//  var options = [DOWNLOAD_ZIP, SAVE_TO_WEB];
//  CTS.UI.modal.select(title, body, options).then(
//    this.saveChoiceMade,
//    function() {
//      console.log("Save canceled.");
//    });
//};

/**
 * Applies any pending changes to the HTML and provides a link to
 * download the modified page as source.
 *
 * See cts-server/app/models/operation.js for operation definition.
 */
//_CTSUI.Editor.prototype.saveChoiceMade = function(choice) {
//  if ((choice != DOWNLOAD_ZIP) && (choice != SAVE_TO_WEB)) {
//    console.log("Unknown save choice: " + choice);
//    return;
//  }
//
//  if (choice == DOWNLOAD_ZIP) {
//  } else if (choice == SAVE_TO_WEB) {
//    CTS.UI.switchboard.flush().then(
//      function(operation) {
//       CTS.UI.modal.alert("Page Saved", "<p><a href='" + url + "'>Download your Page</a></p>");
//      }, function(errMessage) {
//        CTS.UI.modal.alert("Could not save", errMessage);
//      }
//    );
//  }
//
//  CTS.UI.switchboard.recordOperation(operation).then(
//    function(operation) {
//
//      //TODO: This is a hack. Figure out unified way to handle resources IDs.
//      var key = operation.result.url;
//      var url = _CTSUI.serverBase + 'tree/' + key;
//    },
//    function(errorMesage) {
//    }
//  );
//};

_CTSUI.Editor.prototype.downloadClicked = function(choice) {
  if (this._isEditMode) {
    this.exitEditMode();
  }

  CTS.$.fileDownload(CTS.UI.URLs.Services.zipFactory, {
    httpMethod: "POST",
    preparingMessageHtml: "We are preparing an archive of this page. Please wait...",
    failMessageHtml: "There was a problem archiving this page for download.",
    data: {
      'url': window.location.href
    }
  });
//  CTS.UI.switchboard.flush().then(
//    function(operation) {
//     CTS.UI.modal.alert("Page Saved", "<p><a href='" + url + "'>Download your Page</a></p>");
//    }, function(errMessage) {
//      CTS.UI.modal.alert("Could not save", errMessage);
//    }
//  );
};

_CTSUI.Editor.prototype.uploadClicked = function(choice) {
  if (this._isEditMode) {
    this.exitEditMode();
  }

  CTS.UI.switchboard.flush().then(
    function(operation) {
     CTS.UI.modal.alert("Page Saved", "<p><a href='" + url + "'>Download your Page</a></p>");
    }, function(errMessage) {
      CTS.UI.modal.alert("Could not save: " + errMessage);
    }
  );
};

/* DUPLICATE
 * ====================================================================
 */

_CTSUI.Editor.prototype.duplicateClicked = function() {
  if (this._isEditMode) {
    this.exitEditMode();
  }

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
  if (this._isEditMode) {
    this.exitEditMode();
  } else {
    this.enterEditMode();
  }
};

_CTSUI.Editor.prototype.exitEditMode = function() {
  this.completeEdit();
  this._isEditMode = false;
  this._editBtn.removeClass("highlighted");
  CTS.UI.picker.cancel();
};

_CTSUI.Editor.prototype.enterEditMode = function() {
  this._isEditMode = true;
  this._editBtn.addClass("highlighted");
  this.offerEditSelect();
};

_CTSUI.Editor.prototype.offerEditSelect = function() {
  this._editBtn.addClass("highlighted");
  var pickPromise = CTS.UI.picker.pick({
    ignoreCTSUI: true,
    restrict: 'cts-value'
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
  console.log("Begin Edit", $e);
  this._isEditing = true;
  CTS.engine.forrest.stopListening();
  var ctsNode = $e.data('ctsnode');
  if (ctsNode) {
    ctsNode.stash();
  }

  // 1. Stash away the content of the old node.
  if (this._$editNode != null) {
    this.completeEdit();
  }
  this._$editNode= $e;
  $e.attr('contenteditable', 'true');
  this._editBefore = $e.html();
  this._editor = CKEDITOR.inline($e[0], this.ckEditorConfig);
  var self = this;
  this._editor.on('instanceReady', function() {
    self._editor.focus();
  });

  /* 
   * The BLUR event is thrown when the editor loses focus.
   * We turn that back into a select operation.
   */
  this._editor.on('blur', function(evt) {
    // Save the contents.
    self.completeEdit();
    self.offerEditSelect();
  });
};

_CTSUI.Editor.prototype.cancelEdit = function() {
  console.log("Cancel Edit");
  this._isEditing = false;
  CTS.engine.forrest.startListening();
  if (this._$editNode != null) {
    if (this._$editNode) {
      this._$editNode.html(this._editBefore);
      this._$editNode.removeAttr('contenteditable');
    }
    this._$editNode = null;
    if (this._editor) {
      this._editor.destroy();
    }
    this._editBefore = null;
    this._editor = null;
  }
};

_CTSUI.Editor.prototype.completeEdit = function() {
  console.log("Completed Edit");
  var content = null;
  this._isEditing = false;
  CTS.engine.forrest.startListening();
  if (this._$editNode != null) {
    this._editBtn.removeClass("highlighted");
    if ((this._editor != null) && (this._editor.checkDirty())) {
      var selector = CTS.UI.Util.uniqueSelectorFor(this._$editNode);
      content = this._editor.getData();
      console.log("content", content);
  
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
    }
  }
  if (this._editor) {
    this._editor.destroy();
  }
  if (content != null) {
    this._$editNode.html(content);
  }
  if (this._$editNode) {
    this._$editNode.removeAttr('contenteditable');
  }
  this._$editNode = null;
  this._editor = null;
  this._editBefore = null;
};


/* COPY
 *
 * ====================================================================
 */
_CTSUI.Editor.prototype.copyClicked = function() {
  if (this._isEditMode) {
    this.exitEditMode();
  }

 
  var pickPromise = CTS.UI.picker.pick({
    ignoreCTSUI: true
  });
  var self = this;
  
  pickPromise.then(
    function(element) {
      var data = CTS.UI.Util.elementHtml(element);
      console.log(data);
      CTS.UI.clipboard.copy(data);
      Alertify.log.success("Copied to web clipboard.", 1500);
    },
    function(errorReason) {
      Alertify.log.error("Didn't copy: " + errorReason);
    }
  );
};

/* PASTE
 *
 * ====================================================================
 */
_CTSUI.Editor.prototype.pasteClicked = function() {
  if (this._isEditMode) {
    this.exitEditMode();
  }
 
  var pickPromise = CTS.UI.picker.pick({
    ignoreCTSUI: true
  });
  var self = this;
  
  pickPromise.then(
    function(element) {
      CTS.UI.clipboard.paste(function(data) {
        console.log(data);
        element.append(data);
      });
    },
    function(errorReason) {
      Alertify.log.error("Didn't paste: " + errorReason);
    }
  );
};

_CTSUI.Editor.prototype._onCkEditorInstanceCreated = function(event) {
  var editor = event.editor,
  element = editor.element;
 
  // These editors don't need features like smileys, templates, iframes etc.
  if ( element.is( 'h1', 'h2', 'h3' ) || element.getAttribute( 'id' ) == 'taglist' ) {
    // Customize the editor configurations on "configLoaded" event,
    // which is fired after the configuration file loading and
    // execution. This makes it possible to change the
    // configurations before the editor initialization takes place.
    // editor.on( 'configLoaded', function() {
    // });
  }
};

/* Theminator
 *
 * ====================================================================
 */
_CTSUI.Editor.prototype.themesClicked = function() {
  if (this._isEditMode) {
    this.exitEditMode();
  }

  this._tray.invokeTheminator();
};


/* Scrape Clicked
 *
 * ====================================================================
 */
_CTSUI.Editor.prototype.scrapeClicked = function() {
  if (this._isEditMode) {
    this.exitEditMode();
  }

  this._tray.invokeScraper();
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
  var selector = CTS.UI.uniqueSelectorFor(e);
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

_CTSUI.Editor.prototype.requestedWidth = function() {
  return 100;
};

_CTSUI.Editor.prototype.updateSize = function(height) {
  if (typeof this.$container != undefined) {
    this.$container.height(height);
  }
};

