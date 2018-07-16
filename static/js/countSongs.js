$('document').ready(function(){
  var inputURL = document.getElementById('inputURL');
  var countSongs = document.getElementById('countSongs');
  inputURL.addEventListener('input', function() {
    var text = $('#inputURL').val();
    if(text.trim() != '') {
      var lines = text.split(/\r|\r\n|\n/);
      countSongs.innerHTML = 'Descargar (' + lines.length + ')';
    }else{
      countSongs.innerHTML = 'Descargar (0)';
    }
  });
});
