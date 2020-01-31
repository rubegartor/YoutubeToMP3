from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_socketio import SocketIO
import youtube_dl
import string
import random
import zipfile
import os

app = Flask(__name__)
socketIO = SocketIO(app)
app.secret_key = 'key'
totalSongCount = 0
processingSongIndex = 1


def generatePath(length):
    return ''.join(random.choice(string.ascii_letters) for x in range(length))


def ytdl_hook(d):
    percent = (100 / totalSongCount)
    if d['status'] == 'finished':
        global processingSongIndex
        socketIO.emit('updateTotalDownloadProgress', {'percent': percent * processingSongIndex})
        processingSongIndex += 1


def download_mp3(song, path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': '/var/files/downloads/{}/%(title)s.%(ext)s'.format(path),
        'quiet': True,
        'cachedir': '/tmp',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3'
        }],
        'progress_hooks': [ytdl_hook],
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([song])


def zipFile(src, dst):
    zf = zipfile.ZipFile('{}.zip'.format(dst), 'w', zipfile.ZIP_DEFLATED)
    abs_src = os.path.abspath(src)
    for dirname, subdirs, files in os.walk(src):
        for filename in files:
            absname = os.path.abspath(os.path.join(dirname, filename))
            arcname = absname[len(abs_src) + 1:]
            print('[INFO] Zipping {} as {}\n'.format(os.path.join(dirname, filename), arcname))
            zf.write(absname, arcname)
    zf.close()


@app.route('/')
@app.route('/index')
def main():
    return render_template('index.html')


@app.route('/addSong', methods=['POST'])
def addSong():
    try:
        vidInfo = request.json
        vidItem = render_template('components/vid-item.html',
                                  vidId=vidInfo['vidId'],
                                  vidTitle=vidInfo['vidTitle'],
                                  vidDescription=vidInfo['vidDescription'],
                                  channelUrl=vidInfo['channelUrl'],
                                  imageSrc=vidInfo['imageSrc'])

        return jsonify(vidItem)
    except Exception:
        return jsonify(result='err')


@app.route('/getVideoInfo', methods=['POST'])
def getVideoInfo():
    ytUrl = request.json

    def getVideoMetadata(url):
        with youtube_dl.YoutubeDL({'skip_download': True}) as ydl:
            return ydl.extract_info(url, download=False)

    vidInfo = getVideoMetadata(ytUrl['url'])
    vidInfoObject = {
        'vidId': vidInfo.get('id', None),
        'vidTitle': vidInfo.get('title', None),
        'vidDescription': vidInfo.get('uploader', None),
        'channelUrl': vidInfo.get('channel_url', None),
        'imageSrc': vidInfo.get('thumbnail', None)
    }

    return jsonify(vidInfoObject)


@app.route('/processSongs', methods=['POST'])
def getSongs():
    global totalSongCount
    global processingSongIndex
    songs = request.json
    totalSongCount = len(songs)
    path = generatePath(32)

    for song in songs:
        download_mp3(song, path)

    zipFile('/var/files/downloads/{}'.format(path), '/var/files/files/{}'.format(path))

    totalSongCount = 0
    processingSongIndex = 1
    socketIO.emit('downloadReady', {'downloadPath': path})
    return jsonify('')


@app.route('/downloadZip/<path>', methods=['GET', 'POST'])
def downloadZip(path):
    return send_from_directory(directory='/var/files/files/', filename='{}.zip'.format(path))


if __name__ == '__main__':
    socketIO.run(app)
    app.run(host='0.0.0.0', port=5000, debug=False)
