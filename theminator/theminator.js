$(function() {
    $('.screenshot-options').hide();
    $('.add-to-favorites').hide();
    $('.filter-container').children().hide();
    
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
        
    });
    
    $('.screenshot-options,.add-to-favorites').each(function() {
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
            } else if ($(this).find('img').hasClass('favorite')) {
                $(this).html('<img class="hover-favorite" src="images/transparent-star.png">');
            } 
        });
    });
    
    $('a.filter-expand').on('click', function() {
        if ($(this).find('i').hasClass('icon-chevron-down')) {
            $('.filter-content-container').show();
            $('.tag-details').hide();
            $('.filter-options').show();
            $('.filter-container').animate({"height":"130px"},500, function() {
                $('a.filter-expand > i').attr('class', 'icon-chevron-up');
            });
            $('.templates-container').animate( {"height": "388px"} , 500);
        } else if ($(this).find('i').hasClass('icon-chevron-up')) {
            $('.filter-container').animate({"height":"0px"},500, function() {
                $('a.filter-expand > i').attr('class', 'icon-chevron-down');
                $('.filter-container').children().hide();
            });
            $('.templates-container').animate( {"height": "518px"} , 500);
        }
    });
    
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
    
    var showOneFilter = function(filterType) {
        $('.tag-details').show();
        $('.tag-details-type').hide();
        $('.tag-'+filterType+'-details').show();
        $('.tag-details-type').parent().removeClass("active");
        $('.tag-'+filterType+'-details').parent().addClass("active");
    };
    
    $('.previewBtn').on('click', function() {
        if ($(this).hasClass('active')) {
            $(this).parent().parent().find('.tint').removeClass('active');
            $(this).removeClass('active')
        } else {
            $('.tint').removeClass('active');
            $('.previewBtn').removeClass('active');
            $(this).addClass('active');
            $(this).parent().parent().find('.tint').addClass('active');
        }
    });
});