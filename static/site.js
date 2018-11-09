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

function render_form($out, dp, wtype, inputtype) {
  var wtag = $out.attr('data-tag'),
      wcols = $out.attr('data-cols') || DEFAULT_NUM_COLUMNS,
      wtype = $out.attr('data-type'),
      inputtype = $out.attr('data-input');

  console.log('Processing', wtag, wtype, wcols);
  if (typeof(inputtype) === 'undefined')
    inputtype = 'checkbox';

  data = dp.filter(function(i) {
    return i.Type.toLowerCase() == wtype.toLowerCase()
  });

  col_ix = 0; // $out.parent().find('div').count()
  per_col = Math.round(data.length / wcols);
  col_size = 12 / wcols;

  get_col = function() {
    return $out.append('<div class="col-sm-' + col_size + '" />')
               .find('div:last');
  };

  $col = get_col();
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
        '<small>1234</small>' +
      '') +
      '</div>'
    );

    if (++col_ix == per_col) {
      $col = get_col();
      col_ix = 0;
    }
  });
}

// Run search
$('#start').click(function() {
  $.getJSON('/api/images.json', function(data) {

    $('#filters .tab-content').hide();

    filterselect = '';
    $('input:checked').each(function() {
      filterselect += '<span>' + $(this).parent().text() + '</span>';
    });

    $('#selection').empty().append(filterselect);

    var $tgt = $('#results').show().find('div.row').empty();

    data.forEach(function(item) {

      $tgt.append(
        '<div class="col-sm-3 item">' +
        '<img src="' + item.path + '" />' +
        // '<small>' + item.Nummer + '</small>' +
        '</div>'
      ).find('.item:last').click(function() {

        console.log(item);

      });

    });

  }).fail(function(jqxhr, textStatus, error) {
    alert('Could not search!');
    console.log(textStatus, error);
  });
}); // -button.click

// Restore on click
$('#filters .nav-link').click(function() {
  $('#filters .tab-content').show();
  $('#results').hide();

});

})();
