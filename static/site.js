var cache = {}; // global! TODO: sessionStorage / localStorage
var filters = {};

var DEFAULT_NUM_COLUMNS = 4;

(function(){

$.getJSON('/api/filters/all.json', function(jsondata) {
  cache = jsondata;

  // Parse filter structure
  cache.forEach(function(d) {
    if (d.Type == 'Format') return; // TODO: enable Format in the future
    dm = d.Mode.toLowerCase();
    if (!filters[dm])
      filters[dm] = [];
    if (!filters[dm].includes(d.Type))
      filters[dm].push(d.Type);
  });
  // console.log(filters);

  Object.keys(filters).forEach(function(f) {
    init_section(f);
  });

}).fail(function() {
  alert('Could not load data!');
});

function init_section(sname) {
  // Add section headers
  $('#' + sname).each(function() {
    var $tgt = $(this);
    filters[sname].forEach(function(i) {
      if ($('div[data-tag="' + sname + '"]').attr('data-type') == i)
        return;
      $tgt.append(
        '<h5>' + i + '</h5>' +
        '<div class="form-group row" ' +
          'data-tag="' + sname + '" ' +
          'data-type="' + i + '"></div>'
      );
    });
  });

  // Subset the data
  var data = cache.filter(function(i) {
    return i.Mode.toLowerCase() == sname.toLowerCase();
  });

  // Process any tags
  $('div[data-tag="' + sname + '"]').each(function() {
    render_form($(this), data);
  });
}

function attr_or(attr, defaultval) {
  // console.log(attr);
  if (typeof attr !== typeof undefined && attr !== false) {
    return attr;
  } else {
    return defaultval;
  }
}

function render_form($out, dp) {
  var wtag = $out.attr('data-tag'),
      wtype = $out.attr('data-type'),
      wcols = attr_or($out.attr('data-cols'), DEFAULT_NUM_COLUMNS),
      inputtype = attr_or($out.attr('data-input'), 'checkbox');

//   console.log('Processing', wtag, wtype, wcols, inputtype);

  data = dp.filter(function(i) {
    return i.Type.toLowerCase() == wtype.toLowerCase()
  });

  col_ix = 0; // $out.parent().find('div').count()
  per_col = Math.round(data.length / wcols);
  col_size = 12 / wcols;

  get_col = function(colsm) {
    return $out.append('<div class="col-sm-' + colsm + '" />')
               .find('div:last');
  };

  $col = get_col(col_size);
  $.each(data, function() {

    $col.append(
      '<div class="form-check">' + (this.Code == null ? '&nbsp;' :
        '<input class="form-check-input" ' +
          'id="o_' + this.Column + this.Code + '" ' +
          'name="o_' + this.Column + '" ' +
          'value="' + this.Code + '" ' +
/*          'style="display:none"' + */
          'type="' + inputtype + '">' +
        '<label class="form-check-label" ' +
          'for="o_' + this.Column + this.Code + '">' +
          '<count><span>' + this.Count + '</span></count>' +
          this.Title +
          '</label>' +
      '') +
      '</div>'
    );

    if (++col_ix == per_col) {
      $col = get_col(col_size);
      col_ix = 0;
    }

  });
}

// Run search
$('#start').click(werkSearchStart); // -button.click

// Random search
$('#random').click(werkSearchRandom); // -button.click

// Reset search
$('#restart').click(werkSearchReset); // -button.click

// Pagination
$('button#more').click(werkSearchNext); // -button.click

// Close image
$('button#back').click(werkSearchBack); // -button.click

// Search for specific image
$('.searchOnEnter').keypress(function (e) {
  if (e.which == 13) { werkSearchStart(); }
});

// Pop down image
$('#details .image').click(werkSearchBack);

// Restore on click
$('#filters .nav-link').click(function() {
  $('#filters .nav-item.nav-link.btn_bildarchiv').removeClass('active');
  $('#filters .show.active').removeClass('show active');
  $('#filters .tab-content').show();
  $('#results').hide();
});

// Counter on click
$('form').change(function() {
  // Get total for this result
  werkSearchCount();

  if ($('input:checked').length == 0) {
    //console.log('hide Neuauswahl und hide Anzeigen');
    $('#start').addClass('disable');
    $('#restart').addClass('disable');
  } else {
    $('#start').removeClass('disable');
    $('#restart').removeClass('disable');
  }
});

})();
