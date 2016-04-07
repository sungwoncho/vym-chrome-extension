console.log('inserting script......');
let slideEngine = require('./slide_engine');

slideEngine.mount();
$('.diff-view').hide();
$('.file-header[data-path=\'.meteor/packages\']').closest('.file').detach().appendTo('.slide_engine .first');
$('.file-header[data-path=\'.meteor/versions\']').closest('.file').detach().appendTo('.slide_engine .second');

$('.second').hide();
$('.next').on('click', function () {
  $('.first').hide();
  $('.second').show();

});
