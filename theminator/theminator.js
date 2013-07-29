$(function() {
    var favorites = [];
    if (localStorage.getItem("favorites")!==null) {
        favorites = JSON.parse(localStorage["favorites"]);
    }
    
    $('.filter-container').children().hide();
    
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
                tagDetailsList.append('<li><label class="checkbox"><input type="checkbox">'+capitalize(filter)+'</label></li>');
            }
        }
        
        filterInitFunctions();
        
        for (var theme in data.themes) {
            $('.templates-container').append(
                '<div class="screenshot-thumbnail effeckt-caption effeckt-caption-2" data-theme="'+theme+'">'+
                    '<img class="screenshot" src="'+data.themes[theme].screenshot+'">'+
                    '<div class="screenshot-options">'+
                        '<div class="btn-group">'+
                            '<button class="btn previewBtn">Preview</button>'+
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
        }
        
        themeInitFunctions();
        
    });
    
    var capitalize = function(str) {
        var stringArray = str.split(/[\s-]+/);
        for (var w=0; w<stringArray.length; w++) {
            stringArray[w] = stringArray[w].charAt(0).toUpperCase() + stringArray[w].substring(1);
        }
        return stringArray.join(" ");
    }

    
    var themeInitFunctions = function () {
        
        scroll.bind('.templates-container');
        
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
                if ($(this).find('img').hasClass('hover-favorite')) {
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
        
        $('.previewBtn').on('click', function() {
            if ($(this).hasClass('active')) {
                $(this).parents('.screenshot-thumbnail').find('.tint').removeClass('active');
                $(this).removeClass('active')
            } else {
                $('.tint').removeClass('active');
                $('.previewBtn').removeClass('active');
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
                $('.templates-container').animate( {"height": "388px"} , 500);
            } else {
                $('.filter-type').parent().removeClass("active");
                $(this).parent().addClass("active");
                var currentFilter = $('.tag-'+$(this).data('filter')+'-details');
                showOneFilter($(this).data('filter'));
                if ((currentFilter.height()+30) != $('.filter-container').height() && currentFilter.height()>100) {
                    $('.filter-container').animate({"height":(currentFilter.height()+30)+"px"},500);
                    $('.templates-container').animate( {"height": (518-currentFilter.height()-30)+"px"} , 500);
                } else if ($('.filter-container').height() > 130 && currentFilter.height()<=100) {
                    $('.filter-container').animate({"height":"130px"},500);
                    $('.templates-container').animate( {"height": "388px"} , 500);
                }
            }
        });
    };
    
    
    
    $('.deselectBtn').on('click', function() {
        if ($('.tag-details-type:visible').length == 0) {
            $('.tag-details input[type=checkbox]').attr('checked', false);
        } else {
            $('.tag-details-type:visible input[type=checkbox]').attr('checked', false);
        }
    });
    
    
});
