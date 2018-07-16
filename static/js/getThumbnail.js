$('document').ready(function(){
  var inputURL = document.getElementById('inputURL');
  var previewList = document.getElementById('previewList');
  inputURL.addEventListener('input', function() {
    var text = $('#inputURL').val();
    if(text.trim() != '') {
      var lines = text.split(/\r|\r\n|\n/);
      var result = '';
      lines.forEach(function(item) {
        item = item.trim();
        if(item != '') {
          result += '<img src="https://img.youtube.com/vi/' + item.split('=')[1] + '/0.jpg" width="30%" style="margin: 5px;">';
        }
      });
      $('#previewList').html(result);
    }
  });
});
