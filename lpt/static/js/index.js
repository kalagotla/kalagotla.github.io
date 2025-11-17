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
