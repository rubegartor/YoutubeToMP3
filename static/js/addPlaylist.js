$(function() {
  $('#dwlPlaylistBtn').bind('click', function() {
    if($('#playlistInput').val() != '' && $('#playlistInput').val().startsWith('https://www.youtube.com/playlist?list=')) {
      $('#dwlLoader').attr('class', 'fa fa-spinner fa-pulse fa-fw');
      $('#dwlStatus').html('<div class="alert alert-info mt-3"><i class="fas fa-info-circle"></i> Se estan procesando las canciones.</div>');
      $.getJSON($SCRIPT_ROOT + '/getPlaylist', {
        playlist: $('#playlistInput').val()
      }, function(data) {
        $('#dwlLoader').attr('class', 'fas fa-download');
        $('#dwlStatus').html('');
        window.location.href = $SCRIPT_ROOT + '/static/downloads/' + data.result + '.zip';
      });
    }
    return false;
  });
});
