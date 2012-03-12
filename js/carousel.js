/*

jQuery Milax Carousel
jQuery Plugin

Author: Eugene Kuzmin
Copyright: 2012, Eugene Kuzmin

-----------------------------------------------------------------------*/
(function ($) {

    $.fn.mxCarousel = function (settings) {

        // options
        var options = jQuery.extend({
            errorMsgClass: '.mxError',
            errorFieldClass: '.mxNotValidated',
            fieldsToValidateSelector: '.mxValidate',
            btnSubmitSelector: '.btnSubmit',
            fieldHolderSelector: 'dd',
            isValidFunc: false
        }, settings);

        var carouselWrappers = this;

        this.init = function() {
            carouselWrappers.each(function () {
                CarouselWork($(this));
            });
        }


        var CarouselWork = function (currCarousel) {
            var that = this;
            var slides = {
                    holder: currCarousel.find('ul.slider', that)
                },
                nav = {
                    holder: currCarousel.find('.pagination', that)
                },
                rotation = {
                    moveWidth: 0,
                    isScrolling: false,
                    actionSpeed: 500
                };

            slides.items = slides.holder.find('>li', that);
            slides.quantity = slides.items.length;

            nav.links = nav.holder.find('a', that);
            nav.btnNext = nav.holder.find('a.next', that);
            nav.btnPrev = nav.holder.find('a.prev', that);

            /* if no slides - just exit */
            if (!slides.quantity) {
                return false;
            }

            /* click on navigation links handler */
            nav.holder.on('click', 'a', function(){
                var self = $(this);

                if(self.hasClass('current')) {
                    return false;
                }
                else if(self.hasClass('next')) {
                    go2Next();  
                }
                else if (self.hasClass('prev')) {
                    go2Prev();
                }
                else {
                    go2Slide(nav.links.index(self));
                }

                return false;
            });

            /* initial set sizes for the carousel */
            setSizes();

            /* if user resizes a browser window then reinit carousel's sizes */
            $(window).resize(function(){
                setSizes();
            });


            /* function - set/change status of navigation links */
            function setNav(i) {
                if(typeof(i) == 'undefined') {
                    i = slides.holder.find('li:first').data('index');
                }
                nav.links.removeClass('current');
                nav.links.eq(i).addClass('current');
            }

            /* function - go to slide with index @i */
            function go2Slide(i) {
                var indToShow = i,
                    currInd = nav.links.index(nav.holder.find('a.current')),
                    actualSpeed = rotation.actionSpeed/Math.abs(indToShow - currInd);

                if(indToShow > currInd) {
                    go2Next(true, indToShow, actualSpeed);
                }
                else {
                    go2Prev(true, indToShow, actualSpeed);
                }
            }

            /* function - go to the next slide */
            /* @cycle - is needed recursive moving until @indToShow doesn't match current index */
            /* @actualSpeed - speed for animation (the more slides to rotate the faster speed) */
            function go2Next(cycle, indToShow, actualSpeed){
                if (rotation.isScrolling) {
                    return false;
                }
                rotation.isScrolling = true;
                cycle = typeof(cycle) == 'undefined' ? false : cycle; 
                actualSpeed = typeof(actualSpeed) == 'undefined' ? rotation.actionSpeed : actualSpeed;

                var currLeftPos = slides.holder.css('left').replace("px", "");
                currLeftPos = currLeftPos == 'auto' ? 0 : currLeftPos;

                slides.holder.animate({ 'left': "-=" + rotation.moveWidth + 'px' }, actualSpeed, function () {
                    slides.holder.find('li:first').clone().appendTo(slides.holder);
                    slides.holder.find('li:first').remove();
                    slides.holder.css('left', 0);
                    rotation.isScrolling = false;
                    setNav();
                    if(cycle) {
                        var currInd = nav.links.index(nav.holder.find('a.current')); 
                        if(indToShow != currInd) {
                            go2Next(true, indToShow);
                        }
                    }
                });
            }

            /* function - go to the previous slide */
            /* @cycle - is needed recursive moving until @indToShow doesn't match current index */
            /* @actualSpeed - speed for animation (the more slides to rotate the faster speed) */
            function go2Prev(cycle, indToShow, actualSpeed) {
                if (rotation.isScrolling) {
                    return false;
                }
                rotation.isScrolling = true;
                cycle = typeof(cycle) == 'undefined' ? false : cycle; 
                actualSpeed = typeof(actualSpeed) == 'undefined' ? rotation.actionSpeed : actualSpeed;

                var currLeftPos = slides.holder.css('left').replace("px", "");
                currLeftPos = currLeftPos == 'auto' ? 0 : currLeftPos;

                slides.holder.css('left', (currLeftPos - rotation.moveWidth) + 'px');
                slides.holder.find('li:last').clone().prependTo(slides.holder);
                slides.holder.find('li:last').remove();
                slides.holder.animate( { 'left': '+=' + rotation.moveWidth + 'px' }, actualSpeed, function () {
                    rotation.isScrolling = false;
                    setNav();
                    if(cycle) {
                        var currInd = nav.links.index(nav.holder.find('a.current')); 
                        if(indToShow != currInd) {
                            go2Prev(true, indToShow);
                        }
                    }
                } );
                
            }

            /* set/update sizes of slides */
            function setSizes() {
                rotation.moveWidth = parseInt($('.subTopCarousel').width());
                slides.items = slides.holder.find('>li', that);

                slides.holder.width(rotation.moveWidth * (slides.quantity + 1));
                slides.items.width(rotation.moveWidth);
                nav.holder.width(rotation.moveWidth);
            }

        }

        this.init();
    };
})(jQuery);