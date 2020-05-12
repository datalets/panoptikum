var PER_PAGE = 3 * 10;
var clusterTitle = new Clusterize({ //clusterize prepares title search output
  scrollId: 'scrollAreaTitle',
  contentId: 'contentAreaTitle'
});
var clusterYear = new Clusterize({
  scrollId: 'scrollAreaYear',
  contentId: 'contentAreaYear'
});

function hasAttr(attr) {
  return (typeof attr !== typeof undefined && attr !== false)
}

function werkSearchNext(e) {
  var ppp = $('button#more').data('page');
  werkSearchStart(e, ppp + 1);
}

function werkSearchRandom(e) {
  werkSearchReset(e);
  $('#restart').removeClass('disable');
  werkSearchStart(e, 1, true);
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
  /*$('#filters a:first').click();*/ //shows first nav tab.
  $('#total').text('0');
  $('#start').addClass('disable'); /* Anzeigen ausblenden */
  $('#restart').addClass('disable'); /* Neuauswahl ausblenden */
  $('#results').hide(); /* hides results */
  $('#filters .tab-content').show(); /*shows search form*/
  clusterTitle.update(titlelist_uniqueEntries); /* resets title list display*/
  clusterYear.update(yearlist); /* resets year list display*/

  // Show the counters again
  // $('.form-check small').css('visibility', 'visible');
}

// Query builder
function get_werkSearchQuery(from_page) {
  var q = '?sort=-Jahr&';
  q += 'per_page=' + PER_PAGE;

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

// Obtains a count of search results
function werkSearchCount() {
  qg = get_werkSearchQuery(1);
  $('#selection').empty().append(qg.html);
  if (qg.html === '') return $('#total').text('0');

  $.getJSON('/api/images' + qg.query, function(data) {
    $('#total').html(data.total);
    $('#start,#restart').removeClass('disable')
      .addClass(data.total > 0 ? '' : 'disable');
  });

}

// Generates an image subtitle
function werkTitle(item) {
//  console.log("werkTitle "+item['Titel']);
  var Techniken = '';
  if (item['Techniken'] !== null) {
    var itemarr = [];
    item['Techniken'].split(' ').forEach(function(t) {
      getcode = cache.find(f => f['Code'] == t.trim())
      if (typeof getcode !== 'undefined') {
        if (getcode.Title.toLowerCase().indexOf('technik') > 0) return;
        itemarr.push( getcode.Title );
      }
    })
    Techniken = itemarr.join(', ');
  }
  var s = '' +
    '<b>' + (item['Titel'] || '(Ohne Titel)') + '</b> ' +
    '[' + item['Nummer'] + '], ' +
    '' + Techniken + ', ' +
    '' + item['Format'] + 'cm' +
    '' + (item['Jahr'] !== null ?
    ', ' + item['Jahr'].replace('a', '') + '' : '') +
    '' + (item["Zus'arbeit"] !== null ?
      ', In Zusammenarbeit mit ' + item["Zus'arbeit"] : '') +
    '' + (item ['Status'] !== null ?
      ', ' + item ['Status'] : '')
    ;
  return s;
}

// Generates list of Titles, stores them in global titlelist
function listTitles() {
  q = '?sort=-Jahr&per_page=-1';
  let titleItems = [];
  let yearItems = [];

  $.getJSON('/api/images.json' + q, function(data) {
    // Create title item array
    data.forEach(function(item, index) {
      // saves data for years in yearList
      if (item['Jahr'] != null) {
        if (yearItems[item['Jahr'].substr(0,4)]) {
          yearItems[item['Jahr'].substr(0,4)] += 1;
        }else{
          yearItems[item['Jahr'].substr(0,4)] = 1;
        }
      }
      // saves data for titles in titlelist
      if (item['Titel'] != null) {
        fixedItem = '<div>'+item['Titel']+'</div>';
        titleItems.push(fixedItem);
      }
    });
    titleItems.sort(function (a, b) {
      return a.localeCompare(b);
    });

    titlelist = titleItems; //globally available
    titlelist_uniqueEntries = removeDuplicates(titlelist) //removes duplicates and stores it globally.
    //yearlist = yearItems; //globally available

    yearItems.forEach(function(item, index) {
      yearlist.push('<div>'+index+'</div>');
    });

    clusterTitle.update(titlelist_uniqueEntries);
    clusterYear.update(yearlist);
  });
}

function countDuplicates(names) {
  var  count = {};
  names.forEach(function(i) { count[i] = (count[i]||0) + 1;});
  console.log('countDuplicates: '+count);
}

function removeDuplicates(names) {
  let unique = {};
  names.forEach(function(i) {
    if(!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
}

// Main function to run an search
function werkSearchStart(e, from_page, random) {
  if (from_page == typeof undefined)
    from_page = 1;
  if (typeof e !== typeof undefined)
    e.preventDefault(); e.stopPropagation();

  if (random == true) {
    $('#results').find('div.row').empty();
    $('#selection').empty();
    window.location.replace("/#&gid=1&pid=15");
  } else {
    if ($('#start').hasClass('disable')) return;
  }
  $('.modal').modal('show');

  wsq = get_werkSearchQuery(from_page);
  q = wsq.query;

  // Update page number
  $('button#more').data('page', wsq.page);
  if (wsq.page == 1) {
      $('#results').find('div.row').empty();
  }

  $.getJSON(random ? '/api/images.random' : '/api/images.json' + q, function(data) {
    setTimeout(function() {
      $('.modal').modal('hide');
    }, 500);

    $('#filters .tab-content').hide();

    var $tgt = $('#results').show().find('div.row');

    $('button#more').hide();
    if (data.length == PER_PAGE)
      $('button#more').show();

    var pswpElement = $('.pswp')[0];
    var pswpItems = [];
    var pswpGallery = null;
    // var urlPrefix = "http://moirasia.datalets.ch/"
    // var urlPrefix = "http://new.luc.gr/pano/"
    var urlPrefix = "http://archiv.juergstraumann.ch/"

    // Create item index
    data.forEach(function(item, ix) {
      // console.log(item.path);
      // luc.gr-mod
      pswpItems.push({
        src: urlPrefix+item.path, w: 0, h: 0,
        title: werkTitle(item)
      });
    });

    // Generate thumbnails
    data.forEach(function(item, ix) {
      $tgt.append(

        '<div class="col-sm-2 item">' +
          '<img src="' + urlPrefix + item.thumb + '" />' +
          // '<small>' + item.Nummer + '</small>' +
        '</div>'

      ).find('.item:last').click(function() {

         console.debug(item, ix);
        var pswpOptions = { index: ix, loop: false };
        pswpGallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default,
          pswpItems, pswpOptions);
        pswpGallery.listen('imageLoadComplete', function (index, item) {
          if (item.h < 1 || item.w < 1) {
            let img = new Image();
            img.onload = () => {
              item.w = img.width;
              item.h = img.height;
              pswpGallery.invalidateCurrItems();
              pswpGallery.updateSize(true);
            }
            img.src = item.src;
          }
        });
        pswpGallery.init();
        // pswpGallery.goTo(ix);

      });

    }); // -data each

    // Automatically open if only one image or random mode
    if (data.length == 1 || random)
      $tgt.find('.item:last').click();

  }).fail(function(jqxhr, textStatus, error) {
    alert('Could not search!');
//    console.log(textStatus, error);
  });
}
