/*

jQuery Milax Carousel v1.1
jQuery Plugin
Last update: 14.05.2013

Author: Eugene Kuzmin
Copyright: 2012-13, Eugene Kuzmin

-----------------------------------------------------------------------*/
(function ($) {

    $.fn.mxCarousel = function (settings) {

        // options
        var options = jQuery.extend({
            subMainHolderSel: '.subTopCarousel',
            slidesHolderSel: '.slideList',
            slideItemSel: '.slideItem',
            navSels: {
                holder: '.pagination',
                lnk: '.navLnk'
            },
            NEXT_CSS_CLASS: 'next',
            PREV_CSS_CLASS: 'prev',
            CURRENT_CSS_CLASS: 'current'
        }, settings);

        var carouselWrappers = this;

        this.init = function() {
            carouselWrappers.each(function () {
                CarouselWork($(this));
            });
        };


        var CarouselWork = function (currCarousel) {
            var that = this;
            var slides = {
                    holder: currCarousel.find(options.slidesHolderSel, that)
                },
                nav = {
                    holder: currCarousel.find(options.navSels.holder, that)
                },
                rotation = {
                    moveWidth: function() {
                        return parseInt($(options.subMainHolderSel).width(), 10);
                    },
                    isScrolling: false,
                    actionSpeed: 500
                };

            slides.items = slides.holder.find('>li', that);
            slides.quantity = slides.items.length;

            nav.links = nav.holder.find(options.navSels.lnk, that);
            nav.btnNext = nav.holder.find(options.navSels.lnk + '.' + options.NEXT_CSS_CLASS, that);
            nav.btnPrev = nav.holder.find(options.navSels.lnk + '.' + options.PREV_CSS_CLASS, that);

            /* if no slides - just exit */
            if (!slides.quantity) {
                return false;
            }

            /* bindings */
            bindings();
            /* initial set sizes for the carousel */
            setSizes();

            /* function - bind events */
            function bindings() {
                /* if user resizes a browser window then reinit carousel's sizes */
                $(window).resize(setSizes);

                /* click on navigation links handler */
                nav.holder.on('click', options.navSels.lnk, navLnkClickHandler);

                function navLnkClickHandler() {
                    var $self = $(this);

                    if($self.hasClass(options.CURRENT_CSS_CLASS)) {
                        return false;
                    }
                    else if($self.hasClass(options.NEXT_CSS_CLASS)) {
                        go2Next();
                    }
                    else if ($self.hasClass(options.PREV_CSS_CLASS)) {
                        go2Prev();
                    }
                    else {
                        go2Slide(nav.links.index($self));
                    }

                    return false;
                }
            }

            /* function - set/change status of navigation links */
            function setNav(i) {
                i = i || slides.holder.find(options.slideItemSel + ':first').data('index');
                nav.links.removeClass('current');
                nav.links.eq(i).addClass('current');
            }

            /* function - go to slide with index @i */
            function go2Slide(i) {
                var indToShow = i,
                    currInd = nav.links.index(nav.holder.find(options.navSels.lnk + '.' + options.CURRENT_CSS_CLASS)),
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
                cycle = cycle || false;
                actualSpeed = actualSpeed || rotation.actionSpeed;

                var currLeftPos = slides.holder.css('left').replace("px", ""),
                    moveW = rotation.moveWidth();

                currLeftPos = currLeftPos == 'auto' ? 0 : currLeftPos;

                slides.holder.animate({ 'left': "-=" + moveW + 'px' }, actualSpeed, function () {
                    slides.holder.find(options.slideItemSel + ':first').clone().appendTo(slides.holder);
                    slides.holder.find(options.slideItemSel + ':first').remove();
                    slides.holder.css('left', 0);
                    rotation.isScrolling = false;
                    setNav();
                    if(cycle) {
                        var currInd = nav.links.index(nav.holder.find(options.navSels.lnk + '.' + options.CURRENT_CSS_CLASS));
                        if(indToShow !== currInd) {
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
                cycle = cycle || false;
                actualSpeed = actualSpeed || rotation.actionSpeed;

                var currLeftPos = slides.holder.css('left').replace("px", ""),
                    moveW = rotation.moveWidth();

                currLeftPos = (currLeftPos === 'auto') ? 0 : currLeftPos;

                slides.holder.css('left', (currLeftPos - moveW) + 'px');
                slides.holder.find(options.slideItemSel + ':last').clone().prependTo(slides.holder);
                slides.holder.find(options.slideItemSel + ':last').remove();
                slides.holder.animate( { 'left': '+=' + moveW + 'px' }, actualSpeed, function () {
                    rotation.isScrolling = false;
                    setNav();
                    if(cycle) {
                        var currInd = nav.links.index(nav.holder.find(options.navSels.lnk + '.' + options.CURRENT_CSS_CLASS));
                        if(indToShow !==  currInd) {
                            go2Prev(true, indToShow);
                        }
                    }
                } );
            }

            /* set/update sizes of slides */
            function setSizes() {
                var moveW = rotation.moveWidth();
                slides.items = slides.holder.find(options.slideItemSel, that);

                slides.holder.width(moveW * (slides.quantity + 1));
                slides.items.width(moveW);
                nav.holder.width(moveW);
            }
        };

        this.init();
    };
})(jQuery);