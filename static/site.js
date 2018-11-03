jQuery(function($){

$('div[data-tag]').each(function() {
  tag = $(this).attr('data-tag');
  $.getJSON('/api/' + tag + '/json', function(data) {
    render_form(tag, data);
  });
});

function render_form(tag, data, inputtype) {
  if (typeof(inputtype) === 'undefined')
    inputtype = 'checkbox';
  $out = $('#' + tag);
  // console.log(data);
  col_ix = 0; per_col = Math.round(data.length / 4);

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
        'name="' + this.Code + '" ' +
        'value="1" type="checkbox">' +
        this.Title +
      '</label></div>'
    );
    if (++col_ix == per_col) {
      $col = get_col();
      col_ix = 0;
    }
  });
}

});
