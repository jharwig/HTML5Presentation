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
        transform = 'translate('+ transX.toFixed(4) + 'px,' + transY.toFixed(4) + 'px) scale(' + scale.toFixed(4) + ')';
    
    console.log(transform);
    $(document.body).addClass('presentmode');      
    $('.slides').css({
      '-moz-transform': transform,
      '-webkit-transform': transform          
    });
  }
  function move(func) {
    $('.popover').hide();
    
    // builds
    if (func == 'next') {
      for (var i = 0; i < 6; i++) {
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
      current.removeClass('b0 b1 b2 b2 b3 b4 b5');        
      showSlide(current);
    }        
  }
  function moveNext() {
    move('next');
  }
  function movePrevious() {
    move('prev');
  }
  function enablePresentMode() {
    if (!$(document.body).hasClass('presentmode')) {    
      document.body.scrollTop = 0;            
      showSlide(current);    
    }
  }
  function disablePresentMode() {
    if ($(document.body).hasClass('presentmode')) {        
      $(document.body).removeClass('presentmode');
      $('.slides').css({'-moz-transform': '', '-webkit-transform': ''});            
      document.body.scrollTop = Math.max(0, current.offset().top - 100);    
    }
  }
  function togglePresentMode() {
    if ($(document.body).hasClass('presentmode')) {            
      disablePresentMode();
    } else {
      enablePresentMode();
    }
  }
              
  function init() {
    var PAGE_UP = 33,
      PAGE_DOWN = 34,
      ARROW_LEFT = 37,
      ARROW_UP = 38,
      ARROW_RIGHT = 39,
      ARROW_DOWN = 40,
      TAB = 9,
      ESC = 27;

    $(document).keydown(function(e) {            
      switch (e.keyCode) {
        case TAB: 
          e.preventDefault();
          break;
        case PAGE_UP:
        case ARROW_LEFT: 
          movePrevious();
          e.preventDefault();
          break;     
        case PAGE_DOWN:               
        case ARROW_RIGHT:
          moveNext();
          e.preventDefault();
          break;
        case 66:
          togglePresentMode();
          break;
        case ESC:
          if (e.metaKey) {
            disablePresentMode();
          } else {
            $('#browser').remove();            
          }
          break;
      }
    });
    
    $('.slides section').live('dblclick', function() {
      current = $(this);
      enablePresentMode();      
    });
    
    $('.popover').live('click', function(e) {
      e.preventDefault();
      $(this).hide();
    })
    $('button').live('click', function(e){
      e.preventDefault();
    });
    
    // Handle links to open in iframes, and popovers
    $('a').live('click', function(e) {
      e.preventDefault();      
      
      var popoverId = $(this).attr('data:popover');
      if (popoverId) {
        $('#' + popoverId).appendTo(document.body).show();        
        return;
      }
      
      $(document.body).append('<div id="browser"><iframe id="browser_frame" src="' + this.href + '"></iframe></div>');
      var browser = document.getElementById('browser'),
        frame = document.getElementById('browser_frame');
      frame.contentWindow.onload = function() {
        frame.contentWindow.document.addEventListener('keydown', function(e) {
          var KEY_S = 83;
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


// Space timeline
$(function() {
  $('.timeline').each(function() {
    var dates = $.map($(this).find('time'), function(time) {
      return {
        date: new Date($(time).attr('datetime').replace(/-/g,'/')),
        el: time
      };
    });
    if (dates.length === 0) {
      return;
    }

    var first = dates[0].date,
      last = dates[dates.length-1].date,
      range = last - first;
      
    $.each(dates, function(i, d) {
      if (i < dates.length - 1) {
        var years = (dates[i+1].date.getTime() - d.date.getTime()) / 1000 / 60 / 60 / 24 / 365,
          width = Math.max(Math.min((years * 1.5), 20), 2);
        $(d.el).parents('li').width(width + 'em');  
      }            
    });
  });
});
