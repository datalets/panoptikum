var cache = {}; // global! TODO: sessionStorage / localStorage
var filters = {};

var DEFAULT_NUM_COLUMNS = 4;

(function(){

$.getJSON('/api/filters/all.json', function(jsondata) {
  cache = jsondata;

  // Parse filter structure
  cache.forEach(function(d) {
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

  console.log('Processing', wtag, wtype, wcols, inputtype);

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
        '<label class="form-check-label">' +
          '<input class="form-check-input" ' +
          'name="o_' + this.Column + '" ' +
          'value="' + this.Code + '" ' +
          'type="' + inputtype + '">' +
          this.Title +
        '</label>' +
        // '<small>1234</small>' +
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
$('#start').click(werkSearch); // -button.click

// Pagination
$('button#more').click(werkSearchNext); // -button.click

// Search for specific image
$('.searchOnEnter').keypress(function (e) {
  if (e.which == 13) { werkSearch(); }
}).click(function() {
  // Clear the form when tapped
  $('form')[0].reset();
});

// Pop down image
$('#details .image').click(function() {
  var $det = $('#details').hide(); $('#browser').show();

  // $('.top.container').css('visibility', 'visible');
  // $('#results').show();
});

// Restore on click
$('#filters .nav-link').click(function() {
  $('#filters .tab-content').show();
  $('#results').hide();
});

})();
