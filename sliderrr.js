var Sliderrr = function() {
  var current;
  
  function showSlide(section) {   
    console.log('height is ', $('section:nth-child(2)').height());
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
  
    console.log(h, h*scale, transform);
    
    $(document.body).css({
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
          ARROW_DOWN = 40;

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
      }
    });

    // Cache sections offset
    $('section').each(function(){
      $(this).data('offset', $(this).offset());
    });

    $(document.body).addClass('presentmode');        
    current = $('section').first();
    showSlide(current);
  }


  return  {
    current: current,
    init: init
  }
}();
