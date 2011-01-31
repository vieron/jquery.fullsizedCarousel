// 
//  jquery.fullsizedCarousel.js
//  FullWindow image carousel
// 
//  
//  by vieron | http://vieron.net
//

(function($) {
  
  
  $.fn.fullsizedCarousel = function(options) {
    $('html').attr('style', 'overflow:hidden;');
    
    // build main options before element iteration
    var opts = $.extend({}, $.fn.fullsizedCarousel.defaults, options),
        $window = $(window),
        dimensions,
        active_element = 0;
    
    var getDimensions = function(sel){
      return {'height' : sel.height(), 'width' : sel.width()};
    },

    setToWindowDimensions = function(sel, controls){
      var ww = $window.width(),
          wh = $window.height();
      sel.css({'width' : ww+'px' , 'height' : wh+'px' });
      if (opts.resizable_controls == true) controls.css({ 'height' : wh+'px' });
    },
    
    nextSlideHandler = function(n, elements){
      if (n < 0) {
        n = elements.length-1;
      }else if (n > (elements.length-1)){
        n = 0;
      }
      return n;
    },  
    
    fitToScreen = function(opts, $img_wrap, $images, $collection, $controls){
      var d = getDimensions($window);
      
      var ratioW = d.width/opts.element_size['width'];
      var ratioH = d.height/opts.element_size['height'];
      
      ratio = ratioW < ratioH ? ratioH : ratioW;
      
      var width = opts.element_size['width']*ratio;
      var height = opts.element_size['height']*ratio;
      
      var x = (d.width - width)/2;
      var y = (d.height - height)/2;
      
      $img_wrap.css( {'top': y+'px', 'left': x+'px'} );
      $images.css( {'width': width+'px', 'height': height+'px'} );
      
      setToWindowDimensions($collection, $controls);

   };
    
    
    // iterate and reformat each matched element
    return this.each(function(i) {   
      
      var $wrap = $(this),
          $viewport = $(opts.viewport, $wrap),
          $elements_wrap = $(opts.elements_wrap, $viewport),
          $elements = $(opts.element, $elements_wrap),
          $img_wrap = $('div', $elements),
          $images = $('img', $elements),
          $prev = $('<a href="#" class="prev">Prev</a>'),
          $next = $('<a href="#" class="next">Next</a>'),
          $collection = $wrap.add($viewport).add($elements).add($img_wrap),
          $controls = $prev.add($next);
          
          if ($.browser.msie && jQuery.browser.version == "7.0") {
            $collection = $collection.add($('body'));
          }
          
      var goTo = function(n){
         opts.beforeFilter(n);
         $elements_wrap.animate({'left' : -(n*($window.width()))+'px'}, opts.speed, 'swing');
         active_element = n;
      };
    

      setToWindowDimensions($collection, $controls);
      fitToScreen(opts, $img_wrap, $images, $collection, $controls);
      
      
      $window.bind('resize', function(){
        var d = getDimensions($window);
        $elements_wrap.css({'left' : -(active_element*( d.width ))+'px'});
        fitToScreen(opts, $img_wrap, $images, $collection, $controls);
        opts.onResizeWindow(d.height, d.width, $elements_wrap, $collection, $controls );
      });
      
      $window.trigger('resize');
      
      $(opts.controls_wrapper)
        .append($next)
        .append($prev);
        
      
      $next.bind('click', function(e){
        goTo(nextSlideHandler(active_element+1, $elements));
      });
        
      $prev.bind('click', function(e){
        goTo(nextSlideHandler(active_element-1, $elements));
      });
          
      $wrap.bind('goTo', function(e, n){
         goTo(nextSlideHandler(n, $elements));
      });
        
    });
  }; 




  // plugin defaults
  $.fn.fullsizedCarousel.defaults = {
    speed : 800,
    element : "> li",
    elements_wrap : "> ul",
    viewport : '.viewport',
    element_size : {'width' : 1600, 'height' : 1400},
    controls_wrapper : 'body',
    resizable_controls : true,
    beforeFilter : function(n){ },
    onResizeWindow : function($h, $w, $elements_wrap, $collection, $controls ) { }
  };


})(jQuery);