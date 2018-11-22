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

  // console.log('Processing', wtag, wtype, wcols, inputtype);

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
$('#start').click(function() {
  var q = '?';
  q += 'per_page=18';

  filterselect = '';
  $('input:checked').each(function() {
    filterselect += '<span>' + $(this).parent().text() + '</span>';
    q += '&' + $(this).attr('name') + '=' + $(this).attr('value');
  });
  $('input[type=text]').each(function() {
    var v = $(this).val();
    if (!v.length) return;
    filterselect += '<span>' + v + '</span>';
    q += '&' + $(this).attr('name') + '=' + v;
  });

  $.getJSON('/api/images.json' + q, function(data) {

    $('#filters .tab-content').hide();
    $('#filters .show.active').removeClass('show active');
    $('#selection').empty().append(filterselect);

    var $tgt = $('#results').show()
                .find('div.row').empty();

    data.forEach(function(item) {

      $tgt.append(
        '<div class="col-sm-2 item">' +
        '<img src="' + item.thumb + '" />' +
        // '<small>' + item.Nummer + '</small>' +
        '</div>'
      ).find('.item:last').click(function() {

        // console.log(item);

        $('.top.container').css('visibility', 'hidden');
        var $det = $('#details').show();

        $('.image', $det)
          .css('height', $(document).height() - 100)
          .css('background-image', 'url("' + item.path + '")');

        $('[data-fld]', $det).each(function() {
          var fld = $(this).attr('data-fld');

          if (fld == 'Titel' && item[fld] == null)
            return $(this).html('(Ohne Titel)');
          if (fld == 'Jahr')
            return $(this).html(item[fld].replace('a', ''));

          $(this).html(item[fld]);
        });

      });

    });

  }).fail(function(jqxhr, textStatus, error) {
    alert('Could not search!');
    console.log(textStatus, error);
  });
}); // -button.click

// Pop down image
$('#details .image').click(function() {
  var $det = $('#details').hide();
  $('.top.container').css('visibility', 'visible');
});

// Restore on click
$('#filters .nav-link').click(function() {
  $('#filters .tab-content').show();
  $('#results').hide();

});

})();
