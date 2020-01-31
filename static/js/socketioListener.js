$(function () {
    const socket = io('http://0.0.0.0:5000');

    socket.on('updateTotalDownloadProgress', function(result) {
        $('[data-component="totalProgress"]').progress({
          percent: result.percent
        });

        if(result.percent === 100) {
            $('[data-component="label-totalProgress"]').text('Se están terminando de procesar los MP3, sé paciente.')
        }
    });

    socket.on('downloadReady', function (result) {
        hideComponent($('[data-component="totalProgress"]'));
        $('[data-component="label-totalProgress"]').text('');

        $('[data-action="downloadZip"]').data('downloadPath', result.downloadPath);

        $('[data-component="totalProgress"]').progress({
          percent: 0
        });

        $('.blurring').dimmer('show');
        $('.ui.basic.modal').modal({
            onHide: function(){
                $('.blurring').dimmer('hide');
            }
        }).modal('show');
    });
});