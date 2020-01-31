function makeAjax(url, type, data) {
    return new Promise((resolve, reject) =>  {
        $.ajax({
            'url': url,
            'type': type,
            contentType: 'application/json',
            dataType: 'json',
            data: data,
            success: function (data) {
                resolve(data);
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function showInputProcessing() {
    $('#ytUrlInput').parent().attr('class', 'ui icon input loading big fluid');
    $('#ytUrlInput').parent().find('i').attr('class', 'search icon');
}

function restoreInputProcessing() {
    $('#ytUrlInput').parent().attr('class', 'ui fluid icon input big');
    $('#ytUrlInput').parent().find('i').attr('class', 'inverted circular search link icon orange');
}

function showComponent(component) {
    component.css('display', 'block');
}

function hideComponent(component) {
    component.css('display', 'none');
}