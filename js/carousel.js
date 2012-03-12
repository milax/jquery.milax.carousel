if (!Nets) var Nets = {};

(function($){

	$(function(){

		new Nets.Carousel('#topCarousel');


		$('.btn.btnArrow').each(function(){
            var self = $(this);
            var btn = self.find('.button');
            var tagName = btn[0].nodeName.toLowerCase();

            if(tagName == 'span' || tagName == 'button') {
                btn.html('<span class="btnTextHolder">' + $.trim(btn.text()) + '</span>')  
            }
            else {
                btn.wrap('<span class="btnHolder" />');
            }

        });


	})


	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// TODO: the first parameter is selector to find box with carousel functionality
	Nets.Carousel = function (selector)	{

		var carouselWrappers = $(selector);

	    this.Carousel = function () {
	    	// init
	        carouselWrappers.each(function () {
	            CarouselWork($(this));
	        });
	    }

	    var CarouselWork = function (currCarousel) {
	    	var that = this;
	        var carouselUL = currCarousel.find('ul.slider', that),
	        	carouselLI = carouselUL.find('>li', that),
	        	pagination = currCarousel.find('.pagination'),
	        	navLinks = pagination.find('a'),
	        	btnNext = pagination.find('a.next', that),
	        	btnPrev = pagination.find('a.prev', that),
	        	steps = 1,
	        	moveWidth,
	        	isScrolling = false,
	        	actionSpeed = 500;

	        if (!carouselLI.length) {
	            return false;
	        }

			pagination.on('click', 'a', function(){
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
					go2Slide(navLinks.index(self));
				}
				return false;
			});


	        setSizes();

	        $(window).resize(function(){
	        	setSizes();
	        });

	        function setPagination(i) {
	        	if(typeof(i) == 'undefined') {
	        		i = carouselUL.find('li:first').data('index');
	        	}
	        	navLinks.removeClass('current');
	        	navLinks.eq(i).addClass('current');
	        }

	        function go2Slide(i) {
	        	var indToShow = i;
	        	var currInd = navLinks.index(pagination.find('a.current'));
	        	var actualSpeed = actionSpeed/Math.abs(indToShow - currInd);
	        	if(indToShow > currInd) {
        			go2Next(true, indToShow, actualSpeed);
	        	}
	        	else {
	        		go2Prev(true, indToShow, actualSpeed);	
	        	}
	        }

	        function go2Next(cycle, indToShow, actualSpeed){
	            if (isScrolling) {
	                return false;
	            }
	            isScrolling = true;
	            cycle = typeof(cycle) == 'undefined' ? false : cycle; 
	            actualSpeed = typeof(actualSpeed) == 'undefined' ? actionSpeed : actualSpeed;

	            var currLeftPos = carouselUL.css('left').replace("px", "");
	            currLeftPos = currLeftPos == 'auto' ? 0 : currLeftPos;

 	            carouselUL.animate({ 'left': "-=" + moveWidth + 'px' }, actualSpeed, function () {
                    carouselUL.find('li:first').clone().appendTo(carouselUL);
                    carouselUL.find('li:first').remove();
	                carouselUL.css('left', 0);
	                isScrolling = false;
	                setPagination();
	                if(cycle) {
	                	var currInd = navLinks.index(pagination.find('a.current'));	
	                	if(indToShow != currInd) {
	                		go2Next(true, indToShow);
	                	}
	                }
	            });
	        }

	        function go2Prev(cycle, indToShow, actualSpeed) {
	            if (isScrolling) {
	                return false;
	            }
	            isScrolling = true;
	            cycle = typeof(cycle) == 'undefined' ? false : cycle; 
				actualSpeed = typeof(actualSpeed) == 'undefined' ? actionSpeed : actualSpeed;

	            var currLeftPos = carouselUL.css('left').replace("px", "");
				currLeftPos = currLeftPos == 'auto' ? 0 : currLeftPos;

	            carouselUL.css('left', (currLeftPos - moveWidth) + 'px');
                carouselUL.find('li:last').clone().prependTo(carouselUL);
                carouselUL.find('li:last').remove();
	            carouselUL.animate( { 'left': '+=' + moveWidth + 'px' }, actualSpeed, function () {
	            	isScrolling = false;
	            	setPagination();
	                if(cycle) {
	                	var currInd = navLinks.index(pagination.find('a.current'));	
	                	if(indToShow != currInd) {
	                		go2Prev(true, indToShow);
	                	}
	                }	            	
	            } );
	            
	        }

			function setSizes() {
		        var singleBoxWidth = $('.subTopCarousel').width(),
		        	stepWidth = parseInt(singleBoxWidth);
		        	
		        moveWidth = steps * stepWidth;

	        	var carouselLI = carouselUL.find('>li', that);

		        carouselUL.width(parseInt(singleBoxWidth) * (carouselLI.length + parseInt(steps)));
				carouselLI.width(parseInt(singleBoxWidth));
				pagination.width(parseInt(singleBoxWidth));

			}

	    }


	    this.Carousel();
	}




}(jQuery))