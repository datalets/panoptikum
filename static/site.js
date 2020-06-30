var cache = {}; // global! TODO: sessionStorage / localStorage
var filters = {};
var titlelist = {};
var titlelist_uniqueEntries = {}; // global, uniqueEntries in title list
var yearlist = [];

var DEFAULT_NUM_COLUMNS = 4;

(function(){

$.getJSON('/api/filters/all.json', function(jsondata) {
  cache = jsondata;

  // Parse filter structure
  cache.forEach(function(d) {
//    if (d.Type == 'Format') {
//      return; // TODO: enable Format in the future
//    }
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

  // Filter for Titles (calls js function to store titles (all of them) into var titlelist.)
  listTitles();

  // Hack for display "performance" as wished
  var elMagic = $('#o_ParaphrasenPar9b').parent();
  elMagic.appendTo($(elMagic).closest('.col-sm-3').prev());

}).fail(function() {
  alert('Could not load data!');
});

function init_section(sname) {
  // console.log('init_section: '+sname);
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

   //console.log('Processing', wtag, wtype, wcols, inputtype);

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
          'value="\\b' + this.Code + '\\b" ' +
/*          'style="display:none"' + */
          'type="' + inputtype + '">' +
        '<label class="form-check-label" ' +
          'for="o_' + this.Column + this.Code + '">' +
          this.Title +
          (this.Count == 0 ? '' :
            '<span class="count">' + this.Count + '</span> ') +
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

function titleSearch(e) {
//  console.log(this.innerHTML);
  $('input[name="Jahr"]').val(''); //copies Entry to html input form
  $('input[name="Titel"]').val(this.innerHTML); //copies Entry to html input form
 // $('input').prop("checked", false); //unchecks all input boxes, reset selection
  werkSearchCount();
}
function yearSearch(e) {
  $('input[name="Titel"]').val(''); //copies Entry to html input form
  $('input[name="Jahr"]').val(this.innerHTML); //copies Entry to html input form
  //$('input').prop("checked", false); //unchecks all input boxes, reset selection
  werkSearchCount();
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

// Title, Year Search
$('#contentAreaTitle').on('click', 'div', titleSearch);  // -div.click for title search results
$('#contentAreaYear').on('click', 'div', yearSearch);  // -div.click for year search results

// Search for specific image
//$('.searchOnEnter').keypress(function (e) {
//  if (e.which == 13) { werkSearchStart(); }
//});

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
  // console.log('change input');
  $('input[name="Titel"]').val(''); //copies Entry to html input form
  $('input[name="Jahr"]').val(''); //copies Entry to html input form
  // Get total for this result
  werkSearchCount();
});

})();
