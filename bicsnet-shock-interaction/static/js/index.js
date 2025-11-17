window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

    // Accordion functionality
    $(document).on('click', '.accordion-header', function(e) {
        e.stopPropagation();
        var $header = $(this);
        var $content = $header.next('.accordion-content');
        var $item = $header.parent('.accordion-item');
        
        // Toggle active state
        $header.toggleClass('active');
        $content.toggleClass('active');
        
        // Close other accordions (optional - remove if you want multiple open)
        // $('.accordion-item').not($item).find('.accordion-header').removeClass('active');
        // $('.accordion-item').not($item).find('.accordion-content').removeClass('active');
    });

    // Tab functionality - handle clicks on both li and anchor
    $(document).on('click', '.tab-link, .tab-link a', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $tab = $(this).closest('.tab-link');
        var targetTab = $tab.data('tab');
        
        // Remove active class from all tabs and tab contents
        $('.tab-link').removeClass('is-active');
        $('.tab-content').removeClass('is-active');
        
        // Add active class to clicked tab and corresponding content
        $tab.addClass('is-active');
        if (targetTab) {
            $('#' + targetTab).addClass('is-active');
        }
    });

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
