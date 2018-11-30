var PER_PAGE = 18 * 10

function hasAttr(attr) {
  return (typeof attr !== typeof undefined && attr !== false)
}

function werkSearch() {
  var q = '?';
  q += 'per_page=' + PER_PAGE;

  filterselect = '';
  filterdata = {};

  $('input:checked').each(function() {
    var nm = $(this).attr('name');
    if (!hasAttr(nm)) return;
    if (!filterdata[nm]) filterdata[nm] = [];
    filterdata[nm].push($(this).attr('value'));
    filterselect += '<span>' + $(this).parent().text() + '</span>';
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
}
