var song_list = [];

function removeSong(URL) {
  song_list.splice(song_list.indexOf(URL), 1);
  $('#' + URL).remove();
  if(song_list.length === 0) {
    $('#dwlStatus').html('<div class="alert alert-primary text-center"><i class="fas fa-info-circle"></i> Aún no se han añadido canciones a la lista</div>');
  }
}

$(function() {
  $('#modalLoader').hide();

  $('#dwlSongsBtn').bind('click', function() {
    if(song_list.length != 0) {
      $('#dwlLoader').attr('class', 'fa fa-spinner fa-pulse fa-fw');
      $('#dwlStatus').html('<div class="alert alert-info mt-3"><i class="fas fa-info-circle"></i> Se estan procesando las canciones.</div>');
      $.getJSON($SCRIPT_ROOT + '/getSongs', {
        songs: song_list.toString()
      }, function(data) {
        $('#dwlLoader').attr('class', 'fas fa-download');
        $('#dwlStatus').html('');
        window.location.href = $SCRIPT_ROOT + '/static/downloads/' + data.result + '.zip';
      });
    }
    return false;
  });

  $('#addSong').bind('click', function() {
    if($('#modalInput').val().trim() != ''){
      if($('#modalInput').val().startsWith('https://www.youtube.com/watch?v=')){
        if(!song_list.includes($('#modalInput').val().split('=')[1])){
          $('#modalLoader').show();
          $.getJSON($SCRIPT_ROOT + '/addSong', {
            songURL: $('#modalInput').val()
          }, function(data) {
            $('#modalLoader').hide();
            $('#dwlStatus').html('');
            $('#songList').append('<div class="card mt-3 mb-3" id="' + data.result.split('=')[1] + '"><div class="card-body"><div class="row"><div class="col-sm-2"><img src="https://img.youtube.com/vi/' + data.result.split('=')[1] + '/0.jpg" class="img-fluid mx-auto d-block" /></div> <div class="col-sm-10 my-auto">' + data.title + ' (<a href="#" onclick="removeSong(\'' + data.result.split('=')[1] + '\');">Eliminar</a>)</div></div></div></div></div>');
            song_list.push(data.result.split('=')[1]);
            $('#modalInput').val('');
          });
          return false;
        }else{
          $('#modalError').html('<div class="alert alert-warning" id="fadeAlert"><i class="fas fa-info-circle"></i> La canción ya se encuentra en la lista</div>');
          $('#inputURL').val('');
          $('#fadeAlert').fadeTo(3000, 500).slideUp(500, function(){
            $('#fadeAlert').slideUp(500);
          });
        }
      }else{
        $('#modalInput').val('');
      }
    }else{
      $('#modalInput').val('');
    }
  });
});
