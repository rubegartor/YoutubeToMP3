$(function () {
    $('#ytUrlInput').focus();

    $('#ytUrlInput').on('keypress',function(e) {
        if(e.which === 13 && $(this).val().trim() !== '') {
            processVideoInfo()
        }
    });

    $('[data-action="add"]').on('click', function () {
        if($('#ytUrlInput').val().trim() !== ''){
            processVideoInfo()
        }
    });

    $('[data-action="downloadAll"]').on('click', function () {
        let songs = [];
        $('[data-component="vid"]').each(function() {
            songs.push('https://www.youtube.com/watch?v=' + $(this).data('id'));
        });

        processSongs(songs);
    });

    $('[data-action="downloadZip"]').on('click', function (e) {
        e.preventDefault();
        window.location.href = $SCRIPT_ROOT + '/downloadZip/' + $(this).data('downloadPath');
    });

    $(document).on('click', '[data-action="delete"]', function () {
        $('.item[data-id="' + $(this).data('id') + '"]').remove()
    });

    $(document).on('click', '[data-action="downloadOne"]', function () {
        processSongs(['https://www.youtube.com/watch?v=' + $(this).data('id')]);
    });

    $(document).on('click', '[data-action="openUrl"]', function () {
        window.open($(this).data('url'), '_blank');
    });

    function processVideoInfo() {
        showInputProcessing();

        getVideoInfo($('#ytUrlInput').val()).then(result => {
            addSong(result).then(songComponent => {
                $('#vidListContainer').append(songComponent);
                $('#ytUrlInput').val('');
                showComponent($('[data-action="downloadAll"]'));
            }).catch(error => {
                console.error(error)
            }).finally(() => {
                restoreInputProcessing();
            })
        }).catch(error => {
            console.error(error);
            restoreInputProcessing();
        })
    }

    function processSongs(songs) {
        showComponent($('[data-component="totalProgress"]'));
        sendSongs(songs).then((result) => {
            //Nothing happens here :D
        }).catch((error) => {
            console.error(error);
        })
    }

    function getVideoInfo(vidUrl) {
        return makeAjax($SCRIPT_ROOT + '/getVideoInfo','POST', JSON.stringify({'url': vidUrl}));
    }

    function addSong(data) {
        return makeAjax($SCRIPT_ROOT + '/addSong','POST', JSON.stringify(data));
    }

    function sendSongs(songs) {
        return makeAjax($SCRIPT_ROOT + '/processSongs', 'POST', JSON.stringify(songs))
    }
});