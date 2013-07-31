$(function() {
    var favorites = [];
    if (localStorage.getItem("favorites")!==null && localStorage.getItem("favorites")!='undefined') {
        favorites = JSON.parse(localStorage["favorites"]);
    }
    var themes = {};
    var filters = {};
    $('.filter-container').children().hide();
    var themeDisplayList = [];
    
    $.getJSON('content.json', function(data) {
        for (var filterType in data.filters) {
            var tagDetailsType = $('<div class="tag-'+filterType+'-details tag-details-type"></div>');
            var tagDetailsList = $('<ul class="tag-details-list"></ul>');
            tagDetailsType.append(tagDetailsList);
            $('.tag-details').append(tagDetailsType);
            var filterTypeButton = $('<li><a class="filter-type '+filterType+'-filter" data-filter="'+filterType+'"><i class="icon-chevron-left"></i> '+capitalize(filterType)+'</a></li>')
            $('.tag-types-list').append(filterTypeButton);
            for (var i=0; i<data.filters[filterType].length; i++) {
                var filter = data.filters[filterType][i];
                tagDetailsList.append('<li><label class="checkbox"><input type="checkbox"><span>'+capitalize(filter)+'</span></label></li>');
            }
        }
        filters = data.filters;
        
        filterInitFunctions();

        themes = data.themes;
        
        displayNewData(data.themes);
        
    });
    
    var displayThemeThumbnail = function(theme,themeData) {
        $('.templates-container').append(
            '<div class="screenshot-thumbnail effeckt-caption effeckt-caption-2" data-theme="'+theme+'">'+
                '<img class="screenshot" src="'+themeData.screenshot+'">'+
                '<div class="screenshot-options">'+
                    '<div class="btn-group">'+
                        '<button class="btn preview-button">Preview</button>'+
                        '<button class="btn">Install</button>'+
                    '</div>'+
                    
                '</div>'+
                '<a class="add-to-favorites"><img class="not-favorite" src="images/empty-star.png"></a>'+
                '<figcaption>'+
                    '<div class="effeckt-figcaption-wrap">'+
                        '<span class="theme-title">'+capitalize(theme)+'</span>'+
                    '</div>'+
                '</figcaption>'+
            '</div>'
        );
    };
    
    var displayNewData = function(newData) {
        
        paginate(newData);
        displayPage(1);
        
        themeInitFunctions();
    }
    
    var displayNewPage = function(pageNum) {
        displayPage(pageNum);
        
        themeInitFunctions();
    }
    
    var capitalize = function(str) {
        var stringArray = str.split(/[\s-]+/);
        for (var w=0; w<stringArray.length; w++) {
            stringArray[w] = stringArray[w].charAt(0).toUpperCase() + stringArray[w].substring(1);
        }
        return stringArray.join(" ");
    };

    var paginate = function(themesObject) {
        
        themeDisplayList = [];
        var page = {};
        var count = 0;
        for (var theme in themesObject) {
            page[theme] = themesObject[theme];
            count++;
            if (count>7) {
                themeDisplayList.push($.extend({},page));
                page = {};
                count=0;
            }
        }
        if (count!=0) {
            themeDisplayList.push($.extend({},page));
        }
        
    };
    
    var displayPage = function(pageNum) {
        $('.templates-container').empty();
        if (themeDisplayList.length == 0) {
            $('.templates-container').text('No results found');
            $('.pager-custom').empty();
        } else {
            configurePager(pageNum, themeDisplayList.length);
            for (var theme in themeDisplayList[pageNum-1]) {
                displayThemeThumbnail(theme, themeDisplayList[pageNum-1][theme]);
            }
        }
    };
    
    var newPageNumber = function(value) {
        return $('<li><a>'+value+'</a></li>');
    }
    
    var configurePager = function(pageNum, pageLength) {
        $('.pager-custom').empty();
        var leftArrow = $('<li><a><i class="icon-chevron-left"></i></a></li>');
        var rightArrow = $('<li><a><i class="icon-chevron-right"></i></a></li>');
        if (pageNum==1) {
            leftArrow.addClass("disabled");
        }
        if (pageNum==pageLength) {
            rightArrow.addClass("disabled");
        }
        var pageNumbers = []
        if (pageLength<=7) {
            for (var i=1; i<=pageLength; i++) {
                var newPage = newPageNumber(i);
                if (i==pageNum) {
                    newPage.addClass("active");
                }
                pageNumbers.push(newPage);
            }
        } else if (pageLength>7) {
            if (pageNum<=4) {
                for (var i=1; i<=5; i++) {
                    var newPage = newPageNumber(i);
                    if (i==pageNum) {
                        newPage.addClass("active");
                    }
                    pageNumbers.push(newPage);
                }
                pageNumbers.push(newPageNumber('...').addClass('disabled'));
                pageNumbers.push(newPageNumber(pageLength));
            } else if (pageNum+3>=pageLength) {
                pageNumbers.push(newPageNumber(1));
                pageNumbers.push(newPageNumber('...').addClass('disabled'));
                for (var i=pageLength-4; i<=pageLength; i++) {
                    var newPage = newPageNumber(i);
                    if (i==pageNum) {
                        newPage.addClass("active");
                    }
                    pageNumbers.push(newPage);
                }
            } else {
                pageNumbers.push(newPageNumber(1));
                pageNumbers.push(newPageNumber('...').addClass('disabled'));
                pageNumbers.push(newPageNumber(pageNum-1));
                pageNumbers.push(newPageNumber(pageNum).addClass('active'));
                pageNumbers.push(newPageNumber(pageNum+1));
                pageNumbers.push(newPageNumber('...').addClass('disabled'));
                pageNumbers.push(newPageNumber(pageLength));
            }
        }
        $('.pager-custom').append(leftArrow, pageNumbers, rightArrow);
        $('.pager-custom a:not(.active,.disabled)').on('click', function() {
            if (!isNaN($(this).html())) {
                displayNewPage(parseInt($(this).html()));
            } else {
                if ($(this).find('i').hasClass('icon-chevron-left')) {
                    displayNewPage(pageNum-1);
                } else if ($(this).find('i').hasClass('icon-chevron-right')) {
                    displayNewPage(pageNum+1);
                }
            }
        });
    }
    
    var themeInitFunctions = function () {
        
        
        $('.screenshot-options').hide();
        $('.add-to-favorites').hide();
        
        $('.screenshot').each(function() {
            $(this).wrap('<div class="tint"></div>');        
        });
        
        $('.screenshot-thumbnail').each(function() {
            $(this).on('mouseenter', function() {
                $(this).find('.screenshot-options').show();
                $(this).find('.add-to-favorites').show();
            });
            $(this).on('mouseleave', function() {
                $(this).find('.screenshot-options').hide();
                if (!$(this).find('.add-to-favorites').find('img').hasClass('favorite')) {
                    $(this).find('.add-to-favorites').hide();
                }
            });
            if (favorites.indexOf($(this).data("theme")) != -1) {
                $(this).find(".add-to-favorites").html('<img class="favorite" src="images/star.png">');
                $(this).find(".add-to-favorites").show();
            }
        });
        
        $('.screenshot-options,.add-to-favorites,figcaption').each(function() {
            $(this).on('mouseenter', function() {
                $(this).parent().find('.tint').addClass('options-hover');
            });
            $(this).on('mouseleave', function() {
                $(this).parent().find('.tint').removeClass('options-hover');
            });
        });
        
        $('.add-to-favorites').each(function() {
            $(this).on('mouseenter', function() {
                if ($(this).find('img').hasClass('not-favorite')) {
                    $(this).html('<img class="hover-favorite" src="images/transparent-star.png">');
                }
            });
            $(this).on('mouseleave', function() {
                console.log('mouseenter fired');
                if ($(this).find('img').hasClass('hover-favorite')) {
                    console.log('hasclass');
                    $(this).html('<img class="not-favorite" src="images/empty-star.png">');
                }
            });
            $(this).on('click', function() {
                if ($(this).find('img').hasClass('hover-favorite')) {
                    $(this).html('<img class="favorite" src="images/star.png">');
                    favorites.push($(this).parents('.screenshot-thumbnail').data("theme"));
                } else if ($(this).find('img').hasClass('favorite')) {
                    $(this).html('<img class="hover-favorite" src="images/transparent-star.png">');
                    favorites.splice(favorites.indexOf($(this).parents('.screenshot-thumbnail').data("theme")),1);
                    
                }
                localStorage["favorites"] = JSON.stringify(favorites);
            });
        });
        
        $('.preview-button').on('click', function() {
            if ($(this).hasClass('active')) {
                $(this).parents('.screenshot-thumbnail').find('.tint').removeClass('active');
                $(this).removeClass('active')
            } else {
                $('.tint').removeClass('active');
                $('.preview-button').removeClass('active');
                $(this).addClass('active');
                $(this).parents('.screenshot-thumbnail').find('.tint').addClass('active');
            }
        });
    };
    
    $('a.filter-expand').on('click', function() {
        if ($(this).find('i').hasClass('icon-chevron-down')) {
            $('.filter-content-container').show();
            $('.tag-details').hide();
            $('.filter-options').show();
            $('.filter-container').animate({"height":"130px"},500, function() {
                $('a.filter-expand > i').attr('class', 'icon-chevron-up');
            });
            //$('.templates-container').animate( {"height": "388px"} , 500);
        } else if ($(this).find('i').hasClass('icon-chevron-up')) {
            $('.filter-container').animate({"height":"0px"},500, function() {
                $('a.filter-expand > i').attr('class', 'icon-chevron-down');
                $('.tag-types-list li').removeClass("active");
                $('.filter-container').children().hide();
            });
            //$('.templates-container').animate( {"height": "518px"} , 500);
        }
    });
    
    
    
    var showOneFilter = function(filterType) {
        $('.tag-details').show();
        $('.tag-details-type').hide();
        $('.tag-'+filterType+'-details').show();
        $('.tag-details-type').parent().removeClass("active");
        $('.tag-'+filterType+'-details').parent().addClass("active");
    };
    
    var filterInitFunctions = function() {
        $('.filter-type').on('click', function() {
            if ($(this).parent().hasClass("active")) {
                $(this).parent().removeClass("active");
                $('.tag-details-type').hide();
                $('.filter-container').animate({"height":"130px"},500);
                //$('.templates-container').animate( {"height": "388px"} , 500);
            } else {
                $('.filter-type').parent().removeClass("active");
                $(this).parent().addClass("active");
                var currentFilter = $('.tag-'+$(this).data('filter')+'-details');
                showOneFilter($(this).data('filter'));
                if ((currentFilter.height()+30) != $('.filter-container').height() && currentFilter.height()>100) {
                    $('.filter-container').animate({"height":(currentFilter.height()+30)+"px"},500);
                    //$('.templates-container').animate( {"height": (518-currentFilter.height()-30)+"px"} , 500);
                } else if ($('.filter-container').height() > 130 && currentFilter.height()<=100) {
                    $('.filter-container').animate({"height":"130px"},500);
                    //$('.templates-container').animate( {"height": "388px"} , 500);
                }
            }
        });
    };
    
    
    
    $('.deselect-button').on('click', function() {
        if ($('.tag-details-type:visible').length == 0) {
            $('.tag-details input[type=checkbox]').attr('checked', false);
        } else {
            $('.tag-details-type:visible input[type=checkbox]').attr('checked', false);
        }
    });
    
    $('.filter-button').on('click', function() {
        var filterSpans = $('.tag-details input[type=checkbox]:checked').next();
        var filters = [];
        filterSpans.each(function() {
            filters.push($(this).text());
        });
        var filteredThemes = {};
        for (var theme in themes) {
            
            var fits = true;
            
            for (var i=0; i<filters.length; i++) {
                var themeTags = [];
                for (var t=0; t<themes[theme].tags.length; t++) {
                    themeTags.push(capitalize(themes[theme].tags[t]));
                }
                if (themeTags.indexOf(filters[i]) == -1) {
                    fits = false;
                }
            }
            
            if (fits) {
                filteredThemes[theme] = themes[theme];
            }
        }
        displayNewData(filteredThemes);
    });
    
    $('.search-button').on('click', function() {
        var searchFor = $('.search-query').val();
        filteredThemes = {};
        for (var theme in themes) {
            
            var inTags = false;
            for (var i=0; i<themes[theme].tags.length; i++) {
                if (themes[theme].tags[i].indexOf(searchFor) != -1) {
                    inTags = true;
                }
            }
            
            if (theme.indexOf(searchFor) != -1 || inTags) {
                filteredThemes[theme] = themes[theme];
            }
        }
        displayNewData(filteredThemes)
    });
    
    $('.favorites-icon').on('click', function() {
        var displayFavorites = {}
        for (var theme in themes) {
            if (favorites.indexOf(theme) != -1) {
                displayFavorites[theme] = themes[theme];
            }
        }
        displayNewData(displayFavorites);
    });
    
    
});
