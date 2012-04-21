/* -------------------------------------------------------------------------------------------
 * pinner.js
 * by John Tajima, Copyright 2012
 *
 * A simple pinterest-like vertical column layout plugin for jQuery 
 *
 * ------------------------------------------------------------------------------------------ */

(function($){

  $.fn.pinner = function(options) {
    $.fn.pinner.opts            = $.extend({}, $.fn.pinner.defaults, options);
    $.fn.pinner.opts.columns    = {};      // contains contents of each column
    $.fn.pinner.opts.colHeights = [];   // current height of each column
    $.fn.pinner.opts.container  = this;

    var imageSelector = $.fn.pinner.opts.imageSelector;
    var pinSelector   = $.fn.pinner.opts.pinSelector;

    // set imageLoaded listener on all images
    $(imageSelector).imagesLoaded(function(){
      showImages();
    });

    // set imageloaded listener on each image
    $(imageSelector).each(function(i,el){
      $(el).imagesLoaded(function(){
        var parentEl = $(el).parents(pinSelector)[0];
        resizeColumn(parentEl);
      });
    });

    // set resize listener on window
    $(window).on('resize', loadPins);

    loadPins();
    
    return this;
  };

  // defaults
  $.fn.pinner.defaults = {
    pinSelector: '.pin',
    imageSelector: '.thumbnail img',
    showImage: true,
    gutter: 10
  };

  // current option values
  $.fn.pinner.opts = {}

  // private methods
  // --------------------

  // load pins into vertical columns
  function loadPins() {
    var gutter     = $.fn.pinner.opts.gutter;
    var columns    = $.fn.pinner.opts.columns;
    var colHeights = $.fn.pinner.opts.colHeights;
    var settings   = calculateColumnsAndMargin();
    var numCols    = settings.numCols;
    var leftMargin = settings.leftMargin;

    // initialize columns
    for (var i=0;i<numCols;i++) {
      columns[i] = []; colHeights[i] = 0;
    }

    // for each pin, place in shortest column
    $($.fn.pinner.opts.pinSelector).each(function(i,el){
      // find shortest column
      var height = Math.min.apply(null, colHeights);
      var idx = colHeights.indexOf(height);

      // set left and top
      var newTop = height; // calc new top
      var newLeft = leftMargin + ($(el).outerWidth() * idx) + (gutter * (idx+1)); 
      $(el).css({'top': newTop, 'left':newLeft});
      // update new height
      colHeights[idx] += gutter + $(el).outerHeight();
      // add el to column
      columns[idx].push(el);
    });
  }

  // resize column for a given element after image is loaded
  function resizeColumn(el) {
    var gutter     = $.fn.pinner.opts.gutter;
    var columns    = $.fn.pinner.opts.columns;
    var colHeights = $.fn.pinner.opts.colHeights;

    // find column this element belongs to
    var idx, curr_column;
    $.each(columns, function(i, list){ 
      if (list.indexOf(el) > -1) {
        idx = i; curr_column = list;
      }
    });

    // redo css position for each element and resize columnHeight
    colHeights[idx] = 0;  
    $.each(curr_column, function(i,el){
      var newTop = colHeights[idx];
      $(el).css({'top': newTop});
      colHeights[idx] += gutter + $(el).outerHeight();
    })
  }

  function showImages() {
    if ($.fn.pinner.opts.showImage == false) {
      $($.fn.pinner.opts.imageSelector).fadeIn(100);
    }
  }

  // returns number of columns and left-margin offset
  function calculateColumnsAndMargin() {
    var sel       = $.fn.pinner.opts.pinSelector;
    var gutter    = $.fn.pinner.opts.gutter;
    var ctr       = $.fn.pinner.opts.container;

    var ctrWidth  = $(ctr).width();
    var colWidth  = $(sel).outerWidth() + gutter;
    var cols      = parseInt(ctrWidth / colWidth, 10);
    var leftMar   = ((ctrWidth - (cols * colWidth) - gutter) / 2);
    return {numCols: cols, leftMargin: leftMar};
  }

})(jQuery);

