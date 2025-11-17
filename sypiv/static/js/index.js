window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // Lightbox functionality - handle clicks on figure or any child element
    $(document).on('click', '.image-gallery-item, .image-gallery-item img, .image-gallery-item figcaption', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $item = $(this).closest('.image-gallery-item');
        var imageSrc = $item.data('image');
        var caption = $item.data('caption') || '';
        
        if (imageSrc) {
            $('#lightbox-image').attr('src', imageSrc);
            $('#lightbox-caption').text(caption);
            $('#lightbox-modal').addClass('is-active');
            $('body').css('overflow', 'hidden');
        }
    });

    // Close lightbox - prevent event bubbling
    $(document).on('click', '.modal-background', function(e) {
        e.stopPropagation();
        $('#lightbox-modal').removeClass('is-active');
        $('body').css('overflow', 'auto');
    });

    $(document).on('click', '.modal-close', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#lightbox-modal').removeClass('is-active');
        $('body').css('overflow', 'auto');
    });

    // Prevent modal from closing when clicking on the image
    $(document).on('click', '.modal-content', function(e) {
        e.stopPropagation();
    });

    // Close lightbox on ESC key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#lightbox-modal').hasClass('is-active')) {
            $('#lightbox-modal').removeClass('is-active');
            $('body').css('overflow', 'auto');
        }
    });

    // Smooth scrolling for TOC links
    $(document).on('click', '.toc-link', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var target = $(this).attr('href');
        
        if (target && target.startsWith('#')) {
            var $targetElement = $(target);
            if ($targetElement.length) {
                var offset = $targetElement.offset().top - 80; // Account for sticky header
                $('html, body').animate({
                    scrollTop: offset
                }, 600);
            }
        }
    });

    // Update active TOC link on scroll
    var sections = $('section[id]');
    var tocLinks = $('.toc-link');
    
    function updateActiveTOC() {
        var scrollPos = $(window).scrollTop() + 100;
        
        sections.each(function() {
            var $section = $(this);
            var sectionTop = $section.offset().top;
            var sectionBottom = sectionTop + $section.outerHeight();
            var sectionId = $section.attr('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                tocLinks.removeClass('is-active');
                $('.toc-link[href="#' + sectionId + '"]').addClass('is-active');
            }
        });
    }
    
    $(window).on('scroll', updateActiveTOC);
    updateActiveTOC(); // Initial call
})
