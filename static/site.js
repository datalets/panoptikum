$.getJSON('/motive/json', function(data) {
  $out = $('#motive');
  console.log(data);
  $.each(data, function() {
    $out.append(
      '<div class="col-sm-2">' +
      this.Title +
      '</div>'
    );
  });
});
