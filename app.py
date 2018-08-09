from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup as bs
import requests
import youtube_dl
import string
import random
import zipfile
import time
import os

app = Flask(__name__)
app.secret_key = 'key'

def internal_error(e):
  return render_template('e500.html')

def notfound_error(e):
  return render_template('e404.html')

def methodnotallowed_error(e):
  return render_template('e405.html')

app.register_error_handler(500, internal_error)
app.register_error_handler(405, methodnotallowed_error)
app.register_error_handler(404, notfound_error)

def generatePath(length):
  return ''.join(random.choice(string.ascii_letters) for x in range(length))

def download_mp3(song, path):
  ydl_opts = {
    'format': 'bestaudio/best',
    'outtmpl': 'static/downloads/{}/%(title)s.%(ext)s'.format(path),
    'quiet': True,
    'cachedir': '/tmp',
    'postprocessors': [{
      'key': 'FFmpegExtractAudio',
      'preferredcodec': 'mp3'
    }]
  }

  start_time = time.time()
  print('Downloading from: {}'.format(song.rstrip()))
  with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download([song])
  stop_time = time.time()
  print('Downloaded in {} seconds.\n'.format(round(stop_time - start_time, 2)))

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

def getVideoTitle(URL):
  with youtube_dl.YoutubeDL({'skip_download': True,}) as ydl:
    info = ydl.extract_info(URL, download=False)
    return info.get('title', None)

@app.route('/')
def main():
  return render_template('index.html')

@app.route('/index')
def index():
  return render_template('index.html')

@app.route('/addSong')
def addSong():
  res = request.args.get('songURL', '', type=str)
  videoTitle = getVideoTitle(res)
  return jsonify(result=res, title=videoTitle)

@app.route('/getSongs')
def getSongs():
  res = request.args.get('songs', '', type=str)
  songs = list(set(res.split(',')))
  path = generatePath(32)
  if len(songs) != 0:
    for id in songs:
      url = 'https://www.youtube.com/watch?v={}'.format(id)
      req = requests.get(url)
      if req.status_code == requests.codes['ok']:
        try:
          download_mp3(url, path)
        except:
          #No se ha podido descargar el siguiente enlace
          continue
      else:
        pass

    zipFile('static/downloads/{}'.format(path), 'static/downloads/{}'.format(path))
    return jsonify(result=path)
  else:
    return render_template('notvalid.html')

@app.route('/playlist')
def playlist():
  return render_template('playlist.html')

@app.route('/getPlaylist')
def getPlaylist():
  res = request.args.get('playlist', '', type=str)
  r = requests.get(res)
  soup = bs(r.text, 'html.parser')
  res = soup.find_all('a',{'class':'pl-video-title-link'})
  vid_id = [l.get('href').split('=')[1].split('&')[0] for l in res]

  path = generatePath(32)

  for id in vid_id:
    req = requests.get('https://www.youtube.com/watch?v=' + id)
    if req.status_code == requests.codes['ok']:
      try:
        url = 'https://www.youtube.com/watch?v=' + id
        download_mp3(url, path)
      except:
        #No se ha podido descargar el siguiente enlace
        continue

  zipFile('static/downloads/{}'.format(path), 'static/downloads/{}'.format(path))
  return jsonify(result=path)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000, debug=False)
