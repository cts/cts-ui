_CTSUI.Theminator = function(tray, trayContentsNode) {
  this._tray = tray; // A Javascript object
  this._trayContentsNode = trayContentsNode;
  this.loadMockup();
    
  // Initialization
  this.favorites = [];
  this.theminator;
  this.themes = {};
  this.filters = {};
  this.themeDisplayList = [];
};

_CTSUI.Theminator.prototype.loadMockup = function() {
  this._container = CTS.$("<div class='page theminator-page'></div>");
  var cts = "@html theminator " + CTS.UI.Mockups.theminator+ ";";
  cts += "@css " + CTS.UI.CSS.bootstrap + ";";
  cts += "@css " + CTS.UI.CSS.theminator + ";";
  cts += "@js " + CTS.UI.Js.bootstrap + ";";  
  cts += "this :is theminator | #theminator;";
  this._container.attr("data-cts", cts);
  var self = this;
  this._container.on("cts-received-is", function(evt) {
    self.setupMockup()
    evt.stopPropagation();
  });
  this._container.appendTo(this._trayContentsNode);
};

_CTSUI.Theminator.prototype.setupMockup = function() {
    this.theminator = this._container.find('.theminator');
    
    if (localStorage.getItem("favorites")!==null) {
        this.favorites = JSON.parse(localStorage["favorites"]);
    }
    this.theminator.find('.filter-container').children().hide();
    
    this.loadContent();
    this.theminator.find('a.filter-expand').on('click', CTS.$.proxy(this.toggleFilterTray, this));
    
    this.theminator.find('.deselect-button').on('click', CTS.$.proxy(this.deselectFilters, this));
    this.theminator.find('.filter-button').on('click', CTS.$.proxy(this.performFilter, this));
    
    this.theminator.find('.search-button').on('click', CTS.$.proxy(this.performSearch, this));
    
    this.theminator.find('.favorites-icon').on('click', CTS.$.proxy(this.displayFavorites, this));
    

    
};

_CTSUI.Theminator.prototype.loadContent = function() {
    var self = this;
    CTS.$.getJSON(CTS.UI.JSON.content, function(data) {
        for (var filterType in data.filters) {
            var tagDetailsType = CTS.$('<div class="tag-'+filterType+'-details tag-details-type"></div>');
            var tagDetailsList = CTS.$('<ul class="tag-details-list"></ul>');
            tagDetailsType.append(tagDetailsList);
            self.theminator.find('.tag-details').append(tagDetailsType);
            var filterTypeButton = CTS.$('<li><a class="filter-type '+filterType+'-filter" data-filter="'+filterType+'"><i class="icon-chevron-left"></i> '+self.prettify(filterType)+'</a></li>')
            self.theminator.find('.tag-types-list').append(filterTypeButton);
            for (var i=0; i<data.filters[filterType].length; i++) {
                var filter = data.filters[filterType][i];
                tagDetailsList.append('<li><label class="checkbox"><input type="checkbox"><span>'+self.prettify(filter)+'</span></label></li>');
            }
        }
        self.filters = data.filters;
        
        self.initiateFilters();

        self.themes = data.themes;
        
        self.displayNewData(data.themes);
        
    });
};

_CTSUI.Theminator.prototype.displayThemeThumbnail = function(theme, themeData) {
    this.theminator.find('.templates-container').append(
        '<div class="screenshot-thumbnail effeckt-caption effeckt-caption-2" data-theme="'+theme+'">'+
            '<img class="screenshot" src="'+themeData.screenshot+'">'+
            '<div class="screenshot-options">'+
                '<div class="btn-group">'+
                    '<button class="btn preview-button">Preview</button>'+
                    '<button class="btn">Install</button>'+
                '</div>'+
            '</div>'+
            '<a class="add-to-favorites"><img class="not-favorite" src="/css/img/empty-star.png"></a>'+
            '<figcaption>'+
                '<div class="effeckt-figcaption-wrap">'+
                    '<span class="theme-title">'+this.prettify(theme)+'</span>'+
                '</div>'+
            '</figcaption>'+
        '</div>'
    );
};

_CTSUI.Theminator.prototype.displayNewData = function(newData) {
    this.paginate(newData);
    this.displayPage(1);
};

_CTSUI.Theminator.prototype.prettify = function(str) {
    var stringArray = str.split(/[\s-]+/);
    for (var w=0; w<stringArray.length; w++) {
        stringArray[w] = stringArray[w].charAt(0).toUpperCase() + stringArray[w].substring(1);
    }
    return stringArray.join(" ");
}

_CTSUI.Theminator.prototype.paginate = function(themesObject) {
    this.themeDisplayList = [];
    var page = {};
    var count = 0;
    for (var theme in themesObject) {
        page[theme] = themesObject[theme];
        count++;
        if (count>7) {
            this.themeDisplayList.push(CTS.$.extend({},page));
            page = {};
            count=0;
        }
    }
    if (count!=0) {
        this.themeDisplayList.push(CTS.$.extend({},page));
    }
};

_CTSUI.Theminator.prototype.displayPage = function(pageNum) {
    this.theminator.find('.templates-container').empty();
    if (this.themeDisplayList.length == 0) {
        this.theminator.find('.templates-container').text('No results found');
        this.theminator.find('.pager-custom').empty();
    } else {
        this.configurePager(pageNum, this.themeDisplayList.length);
        for (var theme in this.themeDisplayList[pageNum-1]) {
            this.displayThemeThumbnail(theme, this.themeDisplayList[pageNum-1][theme]);
        }
    }
    this.initiateNewThemes();
};

_CTSUI.Theminator.prototype.newPageNumber = function(value) {
    return CTS.$('<li><a>'+value+'</a></li>');
};

_CTSUI.Theminator.prototype.configurePager = function(pageNum, pageLength) {
    
    this.theminator.find('.pager-custom').empty();
    var leftArrow = this.newPageNumber('<i class="icon-chevron-left"></i>');
    var rightArrow = this.newPageNumber('<i class="icon-chevron-right"></i>');
    if (pageNum==1) {
        leftArrow.addClass("disabled");
    }
    if (pageNum==pageLength) {
        rightArrow.addClass("disabled");
    }
    var pageNumbers = []
    if (pageLength<=7) {
        for (var i=1; i<=pageLength; i++) {
            var newPage = this.newPageNumber(i);
            if (i==pageNum) {
                newPage.addClass("active");
            }
            pageNumbers.push(newPage);
        }
    } else if (pageLength>7) {
        if (pageNum<=4) {
            for (var i=1; i<=5; i++) {
                var newPage = this.newPageNumber(i);
                if (i==pageNum) {
                    newPage.addClass("active");
                }
                pageNumbers.push(newPage);
            }
            pageNumbers.push(this.newPageNumber('...').addClass('disabled'));
            pageNumbers.push(this.newPageNumber(pageLength));
        } else if (pageNum+3>=pageLength) {
            pageNumbers.push(this.newPageNumber(1));
            pageNumbers.push(this.newPageNumber('...').addClass('disabled'));
            for (var i=pageLength-4; i<=pageLength; i++) {
                var newPage = this.newPageNumber(i);
                if (i==pageNum) {
                    newPage.addClass("active");
                }
                pageNumbers.push(newPage);
            }
        } else {
            pageNumbers.push(this.newPageNumber(1));
            pageNumbers.push(this.newPageNumber('...').addClass('disabled'));
            pageNumbers.push(this.newPageNumber(pageNum-1));
            pageNumbers.push(this.newPageNumber(pageNum).addClass('active'));
            pageNumbers.push(this.newPageNumber(pageNum+1));
            pageNumbers.push(this.newPageNumber('...').addClass('disabled'));
            pageNumbers.push(this.newPageNumber(pageLength));
        }
    }
    this.theminator.find('.pager-custom').append(leftArrow, pageNumbers, rightArrow);
    this.theminator.find('.pager-custom a:not(.active,.disabled)').on('click', CTS.$.proxy(this.goToNewPage, this, pageNum));
};

_CTSUI.Theminator.prototype.goToNewPage = function(evt) {
    var pagerValue = CTS.$(evt.target);
    console.log(pagerValue);
    if (!isNaN(pagerValue.html())) {
        this.displayPage(parseInt(pagerValue.html()));
    } else {
        if (pagerValue.find('i').hasClass('icon-chevron-left')) {
            this.displayPage(pageNum-1);
        } else if (pagerValue.find('i').hasClass('icon-chevron-right')) {
            this.displayPage(pageNum+1);
        }
    }
};

_CTSUI.Theminator.prototype.initiateThumbnailVisibilities = function(thumbnail) {
    thumbnail.on('mouseenter', function() {
        CTS.$(this).find('.screenshot-options').show();
        CTS.$(this).find('.add-to-favorites').show();
    });
    thumbnail.on('mouseleave', function() {
        CTS.$(this).find('.screenshot-options').hide();
        if (CTS.$(this).find('.add-to-favorites').find('img').hasClass('favorite')) {
            CTS.$(this).find('.add-to-favorites').hide();
        }
    });
    if (this.favorites.indexOf(thumbnail.data("theme")) != -1) {
        thumbnail.find(".add-to-favorites").html('<img class="favorite" src="/css/img/star.png">');
        thumbnail.find(".add-to-favorites").show();
    }
};

_CTSUI.Theminator.prototype.initiateScreenshotTints = function(screenshot) {
    screenshot.wrap('<div class="tint"></div>'); 
};

_CTSUI.Theminator.prototype.initiateTintVisibility = function(overlay) {
    overlay.on('mouseenter', function() {
        overlay.parent().find('.tint').addClass('options-hover');
    });
    overlay.on('mouseleave', function() {
        overlay.parent().find('.tint').removeClass('options-hover');
    });
};

_CTSUI.Theminator.prototype.initiateFavoritesEvents = function(favoriteButton) {
    favoriteButton.on('mouseenter', function() {
        if (CTS.$(this).find('img').hasClass('not-favorite')) {
            CTS.$(this).html('<img class="hover-favorite" src="/css/img/transparent-star.png">');
        }
    });
    favoriteButton.on('mouseleave', function() {
        if (CTS.$(this).find('img').hasClass('hover-favorite')) {
            CTS.$(this).html('<img class="not-favorite" src="/css/img/empty-star.png">');
        }
    });
    favoriteButton.on('click', CTS.$.proxy(this.toggleFavorite, this));
};

_CTSUI.Theminator.prototype.toggleFavorite = function(evt) {
    var favoriteButton = CTS.$(evt.target);
    if (favoriteButton.find('img').hasClass('hover-favorite')) {
        favoriteButton.html('<img class="favorite" src="/css/img/star.png">');
        this.theminator.favorites.push(favoriteButton.parents('.screenshot-thumbnail').data("theme"));
    } else if (favoriteButton.find('img').hasClass('favorite')) {
        favoriteButton.html('<img class="hover-favorite" src="/css/img/transparent-star.png">');
        this.theminator.favorites.splice(this.theminator.favorites.indexOf(favoriteButton.parents('.screenshot-thumbnail').data("theme")),1);
        
    }
    localStorage["favorites"] = JSON.stringify(this.theminator.favorites);
}

_CTSUI.Theminator.prototype.togglePreview = function(evt) {
    var previewButton = CTS.$(evt.target);
    if (previewButton.hasClass('active')) {
        previewButton.parents('.screenshot-thumbnail').find('.tint').removeClass('active');
        previewButton.removeClass('active')
    } else {
        this.theminator.find('.tint').removeClass('active');
        this.theminator.find('.preview-button').removeClass('active');
        previewButton.addClass('active');
        previewButton.parents('.screenshot-thumbnail').find('.tint').addClass('active');
    }
};

_CTSUI.Theminator.prototype.initiateNewThemes = function() {
    var self = this;
    this.theminator.find('.screenshot-options').hide();
    this.theminator.find('.add-to-favorites').hide();
    this.theminator.find('.screenshot').each( function() {
        self.initiateScreenshotTints(CTS.$(this));
    });
    this.theminator.find('.screenshot-thumbnail').each(function() {
        self.initiateThumbnailVisibilities(CTS.$(this))
    });
    this.theminator.find('.screenshot-options,.add-to-favorites,figcaption').each(function() {
        self.initiateTintVisibility(CTS.$(this))
    });
    this.theminator.find('.add-to-favorites').each(function() {
        self.initiateFavoritesEvents(CTS.$(this))
    });
    this.theminator.find('.preview-button').on('click', CTS.$.proxy(this.togglePreview, this));
}

_CTSUI.Theminator.prototype.toggleFilterTray = function(evt) {

    var toggleButton = CTS.$(evt.target).parent('.filter-expand').andSelf().not('i');
    var self = this;
    if (toggleButton.find('i').hasClass('icon-chevron-down')) {
        this.theminator.find('.filter-content-container').show();
        this.theminator.find('.tag-details').hide();
        this.theminator.find('.filter-options').show();
        this.theminator.find('.filter-container').animate({"height":"130px"},500, function() {
            self.theminator.find('a.filter-expand > i').attr('class', 'icon-chevron-up');
        });
    } else if (toggleButton.find('i').hasClass('icon-chevron-up')) {
        this.theminator.find('.filter-container').animate({"height":"0px"},500, function() {
            self.theminator.find('a.filter-expand > i').attr('class', 'icon-chevron-down');
            self.theminator.find('.tag-types-list li').removeClass("active");
            self.theminator.find('.filter-container').children().hide();
        });
    }
};

_CTSUI.Theminator.prototype.showOneFilter = function(filterType) {
    this.theminator.find('.tag-details').show();
    this.theminator.find('.tag-details-type').hide();
    this.theminator.find('.tag-'+filterType+'-details').show();
    this.theminator.find('.tag-details-type').parent().removeClass("active");
    this.theminator.find('.tag-'+filterType+'-details').parent().addClass("active");
};

_CTSUI.Theminator.prototype.initiateFilters = function() {
    this.theminator.find('.filter-type').on('click', CTS.$.proxy(this.openFilterType, this));
};

_CTSUI.Theminator.prototype.openFilterType = function(evt) {
    var typeButton = CTS.$(evt.target).parent('.filter-type').andSelf().not('i');
    if (typeButton.parent().hasClass("active")) {
        typeButton.parent().removeClass("active");
        this.theminator.find('.tag-details-type').hide();
        this.theminator.find('.filter-container').animate({"height":"130px"},500);
        //$('.templates-container').animate( {"height": "388px"} , 500);
    } else {
        this.theminator.find('.filter-type').parent().removeClass("active");
        typeButton.parent().addClass("active");
        var currentFilter = this.theminator.find('.tag-'+typeButton.data('filter')+'-details');
        this.showOneFilter(typeButton.data('filter'));
        if ((currentFilter.height()+30) != this.theminator.find('.filter-container').height() && currentFilter.height()>100) {
            this.theminator.find('.filter-container').animate({"height":(currentFilter.height()+30)+"px"},500);
            //$('.templates-container').animate( {"height": (518-currentFilter.height()-30)+"px"} , 500);
        } else if (this.theminator.find('.filter-container').height() > 130 && currentFilter.height()<=100) {
            this.theminator.find('.filter-container').animate({"height":"130px"},500);
            //$('.templates-container').animate( {"height": "388px"} , 500);
        }
    }
};


_CTSUI.Theminator.prototype.deselectFilters = function() {
    if (this.theminator.find('.tag-details-type:visible').length == 0) {
        this.theminator.find('.tag-details input[type=checkbox]').attr('checked', false);
    } else {
        this.theminator.find('.tag-details-type:visible input[type=checkbox]').attr('checked', false);
    }
};

_CTSUI.Theminator.prototype.performFilter = function() {
    alert('filtering')
    var filterSpans = this.theminator.find('.tag-details input[type=checkbox]:checked').next();
    var filters = [];
    filterSpans.each(function() {
        filters.push(this.text());
    });
    var filteredThemes = {};
    for (var theme in this.themes) {
        
        var fits = true;
        
        for (var i=0; i<filters.length; i++) {
            var themeTags = [];
            for (var t=0; t<this.themes[theme].tags.length; t++) {
                themeTags.push(this.prettify(this.themes[theme].tags[t]));
            }
            if (themeTags.indexOf(filters[i]) == -1) {
                fits = false;
            }
        }
        
        if (fits) {
            filteredThemes[theme] = this.themes[theme];
        }
    }
    this.displayNewData(filteredThemes);
}

_CTSUI.Theminator.prototype.performSearch = function() {
    var searchFor = this.theminator.find('.search-query').val();
    var searchedThemes = {};
    for (var theme in this.themes) {
        
        var inTags = false;
        for (var i=0; i<this.themes[theme].tags.length; i++) {
            if (this.themes[theme].tags[i].indexOf(searchFor) != -1) {
                inTags = true;
            }
        }
        
        if (theme.indexOf(searchFor) != -1 || inTags) {
            searchedThemes[theme] = this.themes[theme];
        }
    }
    this.displayNewData(searchedThemes);
};

_CTSUI.Theminator.prototype.displayFavorites = function() {
    var displayFavoritesList = {}
    for (var theme in this.themes) {
        if (this.favorites.indexOf(theme) != -1) {
            displayFavoritesList[theme] = this.themes[theme];
        }
    }
    this.displayNewData(displayFavoritesList);
}


_CTSUI.Theminator.prototype.updateSize = function(height) {
    this._container.height(height);
};
