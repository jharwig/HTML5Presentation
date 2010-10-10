var Sliderrr = function() {
  var current;
  
  function showSlide(section) {   
    var s = $(section),
        w = s.width(),
        h = s.height(),
        vW = $(window).width(),
        vH = $(window).height(),
        scaleX = vW / w,
        scaleY = vH / h,
        scale = Math.min(scaleX, scaleY),
        transX = (s.data('offset').left*scale*-1 + vW/2 - w*scale/2),
        transY = (s.data('offset').top*scale*-1 + vH/2 - h*scale/2),
        transform = 'translate('+ transX + 'px, ' + transY + 'px) scale(' + scale + ')';    
      
    $('.slides').css({
      '-moz-transform': transform,
      '-webkit-transform': transform          
    });
  }
  function move(func) {
    var el = current[func]('section');
    if (el && el.length) {
      current = el;
      showSlide(current);
    }        
  }
  function moveNext() {
    move('next');
  }
  function movePrevious() {
    move('prev');
  }
  
  function init() {
    var ARROW_LEFT = 37,
      ARROW_UP = 38,
      ARROW_RIGHT = 39,
      ARROW_DOWN = 40,
      ESC = 27;

    $(document).keydown(function(e) {
      switch (e.keyCode) {
        case ARROW_LEFT: 
          movePrevious();
          e.preventDefault();
          break;          
        case ARROW_RIGHT:
          moveNext();
          e.preventDefault();
          break;
        case ESC:
          $('#browser').remove();
          break;
      }
    });
    
    $('a').live('click', function(e) {
      e.preventDefault();
      
      $(document.body).append('<div id="browser"><iframe id="browser_frame" src="' + this.href + '"></iframe></div>');

      var browser = document.getElementById('browser'),
        frame = document.getElementById('browser_frame');
      frame.contentWindow.onload = function() {
        frame.contentWindow.document.addEventListener('keydown', function(e) {
          if (e.keyCode == ESC) {
            browser.parentNode.removeChild(browser);
          }
        }, false);        
      };
    });

    // Cache sections offset
    $('section').each(function(){
      $(this).data('offset', $(this).offset());
    });

    $(document.body).addClass('presentmode');        
    current = $('.slides section').first();
    showSlide(current);
  }


  return  {
    current: current,
    init: init
  }
}();
