$.getJSON('/motive/json', function(data) {
  $out = $('#motive');
  console.log(data);
  col_ix = 0; per_col = Math.round(data.length / 4);
  get_col = function() {
    return $out.append('<div class="col-sm-3" />').find('div:last');
  };
  $col = get_col();
  $.each(data, function() {
    $col.append(
      '<div class="item">' +
        this.Title +
      '</div>'
    );
    if (++col_ix == per_col) {
      $col = get_col();
      col_ix = 0;
    }
  });
});
