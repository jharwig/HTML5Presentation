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
        transform = 'translate('+ transX.toFixed(4) + 'px, ' + transY.toFixed(4) + 'px) scale(' + scale.toFixed(4) + ')';    
      
    $(document.body).addClass('presentmode');      
    $('.slides').css({
      '-moz-transform': transform,
      '-webkit-transform': transform          
    });
  }
  function move(func) {

    // builds
    if (func == 'next') {
      for (var i = 0; i < 5; i++) {
        var cls = 'b' + i;
        if (current.find('.' + cls).length === 0) {
          break;
        }
        
        if (!current.hasClass(cls)) {
          current.addClass('b' + i);
          return;
        }
      }      
    }
      
    var el = current[func]('section');
    if (el && el.length) {
      current = el;
      current.removeClass('b0 b1 b2 b2 b3 b4');        
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
    
    $('.slides section').live('dblclick', function() {
      if ($(document.body).hasClass('presentmode')) {
        $(document.body).removeClass('presentmode');
        $('.slides').css({
          '-moz-transform': '',
          '-webkit-transform': ''          
        });
      } else {
        document.body.scrollTop = 0;
        current = $(this);
        showSlide(current);
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
    $('.slides section').each(function(){
      $(this).data('offset', $(this).offset());
    });
            
    current = $('.slides section').first();
    showSlide(current);
  }


  return  {
    current: current,
    init: init
  }
}();
