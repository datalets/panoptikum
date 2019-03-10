var PER_PAGE = 3 * 10

function hasAttr(attr) {
  return (typeof attr !== typeof undefined && attr !== false)
}

function werkSearchNext(e) {
  var ppp = $('button#more').data('page');
  werkSearchStart(e, ppp + 1);
}

function werkSearchRandom(e) {
  werkSearchStart(e, -1);
}

function werkSearchBack(e) {
  if (typeof e !== typeof undefined)
    e.preventDefault(); e.stopPropagation();

  var $det = $('#details').hide(); $('#browser').show();

  // $('.top.container').css('visibility', 'visible');
  // $('#results').show();
}

function werkSearchReset(e) {
  if (typeof e !== typeof undefined)
    e.preventDefault(); e.stopPropagation();

  // Clear the form and return to start when tapped
  $('form')[0].reset();
  $('#filters a:first').click();

  // Show the counters again
  // $('.form-check small').css('visibility', 'visible');

  $('#stats').addClass('fade');
}

// Query builder
function get_werkSearchQuery(from_page) {
  var q = '?sort=-Jahr&';
  q += 'per_page=' + PER_PAGE;

  if (from_page === -1) {
    from_page = 1;
    ranval = Math.round(1+(Math.random() * 6669));
    $('input[name="Nummer"]').click().val(ranval);
  }

  var ppp = (typeof from_page === typeof 1) ? from_page : 1;
  q += '&page=' + ppp;

  filterselect = '';
  filterdata = {};

  $('input:checked').each(function() {
    var nm = $(this).attr('name');
    if (!hasAttr(nm)) return;
    if (!filterdata[nm]) filterdata[nm] = [];
    filterdata[nm].push($(this).attr('value'));
    filterselect += '<span>' + $(this).parent().find('label').text() + '</span>';
  });

  $('input[type=text]').each(function() {
    var nm = $(this).attr('name');
    if (!hasAttr(nm)) return;
    if (!nm.indexOf('o_') == 0) nm = 'o_' + nm;
    var v = $(this).val();
    if (!v.length) return;
    if (!filterdata[nm]) filterdata[nm] = [];
    filterdata[nm].push(v);
    filterselect += '<span>' + v + '</span>';
  });

  $.each(Object.keys(filterdata), function() {
    q += '&' + this + '=' + filterdata[this].join(',');
  });

  return {
    data: filterdata,
    html: filterselect,
    page: ppp,
    query: q
  }
}

function werkSearchCount() {
  qg = get_werkSearchQuery(1);
  $('#selection').empty().append(qg.html);
  $.getJSON('/api/images' + qg.query, function(data) {
    $('#total').html(data.total);
    $('#stats').removeClass('fade');
    $('#start').removeClass('btn-success disable')
      .addClass(data.total > 0 ? 'btn-success' : 'disable');
  });
}

function werkSearchStart(e, from_page) {
  if (typeof e !== typeof undefined)
    e.preventDefault(); e.stopPropagation();

  if ($('#start').hasClass('disable')) return;

  $('.modal').modal('show');

  wsq = get_werkSearchQuery(from_page);
  q = wsq.query;

  // Update page number
  $('button#more').data('page', wsq.page);
  if (wsq.page == 1) {
      $('#results').find('div.row').empty();
  }

  $.getJSON('/api/images.json' + q, function(data) {
    setTimeout(function() {
      $('.modal').modal('hide');
    }, 500);

    $('#filters .tab-content').hide();
    $('#filters .show.active').removeClass('show active');

    var $tgt = $('#results').show().find('div.row');

    $('button#more').hide();
    if (data.length == PER_PAGE)
      $('button#more').show();

    data.forEach(function(item) {

      $tgt.append(
        '<div class="col-sm-2 item">' +
        '<img src="' + item.thumb + '" />' +
        // '<small>' + item.Nummer + '</small>' +
        '</div>'
      ).find('.item:last').click(function() {

        // console.log(item);
        window.scrollTo(0,0);

        // Hide the results container
        var $det = $('#details').show(); $('#browser').hide();

        // $('.main.container').css('visibility', 'hidden');

        $('.image', $det)
          .css('height', $(window).height() - 100)
          .css('background-image', 'url("' + item.path + '")');

        $('[data-fld]', $det).each(function() {
          var fld = $(this).attr('data-fld');
          itemstr = item[fld]

          if (fld == 'Titel' && item[fld] == null)
            itemstr = '(Ohne Titel)';
          if (fld == 'Jahr' && item[fld] !== null)
            itemstr = item[fld].replace('a', '');
          if (fld == "Zus'arbeit" && item[fld] !== null)
            itemstr = '~ In Zusammenarbeit mit ' + item[fld];
          if (fld == "Techniken") {
            itemarr = itemstr.split(' '); itemstr = '';
            itemarr.forEach(function(t) {
              getcode = cache.find(f => f['Code'] == t.trim())
              if (typeof getcode !== 'undefined') {
                itemstr += '<sm>' + getcode.Title + '</sm> '
              }
            })
          }
          $(this).html(itemstr);
        });

      });

    }); // -data each

    if (data.length == 1)
      $tgt.find('.item:last').click();

  }).fail(function(jqxhr, textStatus, error) {
    alert('Could not search!');
    console.log(textStatus, error);
  });
}
