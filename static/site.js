var cache = {}; // global! TODO: sessionStorage / localStorage

(function(){

// TODO: load from DP
var ds = {
  'inhalt': [
    "Motive",
    "Paraphrasen, Variationen",
    "Paraphrasen, Variationen: grössere Werkgruppen zu",
    "Projekt „Klee revisited“"
  ],
  'forms': [
    "Technik",
    "Drucktechnik",
    "mehrere Techniken",
    "Helligkeit",
    "Farbigkeit nach Dominanz",
    "Format",
    "Ausrichtung",
    "Darstellungsformen",
    "Darstellungsarten",
    "Bildsprache"
  ],
  'zeiten': []
};

init_section('inhalt');
init_section('forms');
init_section('zeiten');

function init_section(sname) {
  $('#' + sname).each(function() {
    var $tgt = $(this);
    ds[sname].forEach(function(i) {
      $tgt.append(
        '<h5>' + i + '</h5>' +
        '<div class="form-group row" ' +
          'data-tag="' + sname + '" ' +
          'data-type="' + i + '"></div>'
      );
    });
  });

  $.getJSON('/api/' + sname + '/json', function(data) {
    console.log('Loading', sname);
    cache[sname] = data;
    $('div[data-tag="' + sname + '"]').each(function() {
      var $obj = $(this),
          tag = $obj.attr('data-tag'),
          typ = $obj.attr('data-type'),
          inp = $obj.attr('data-input');

      console.log('Processing', tag, typ);
      data = cache[tag];
      render_form($obj, data, typ, inp);
    });
  });
}

function render_form($out, dp, wtype, inputtype) {
  if (typeof(inputtype) === 'undefined')
    inputtype = 'checkbox';

  data = dp.filter(function(i) {
    return i.Type.toLowerCase() === wtype.toLowerCase()
  });
  // console.log(data);
  col_ix = 0; // $out.parent().find('div').count()
  per_col = Math.round(data.length / 4);

  get_col = function() {
    return $out.append('<div class="col-sm-3" />')
               .find('div:last');
  };

  $col = get_col();
  $.each(data, function() {

    $col.append(
      '<div class="form-check">' +
        '<label class="form-check-label">' +
        '<input class="form-check-input" ' +
        'name="o_' + this.Column + '" ' +
        'value="' + this.Code + '" ' +
        'type="' + inputtype + '">' +
        this.Title +
      '</label></div>'
    );

    if (++col_ix == per_col) {
      $col = get_col();
      col_ix = 0;
    }
  });
}

})();
