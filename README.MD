# YoutubeToMP3
YoutubeToMP3 es un downloader y conversor de videos de Youtube a MP3 con la posibilidad de crear una lista de videos y descargar todos los mp3 en un mismo archivo comprimido (.zip) a través de Flask y Socket.io

## YoutubeToMP3 preview:
![index.html](https://i.imgur.com/UWV0P0V.png)
![index.html](https://i.imgur.com/y8aUfN0.png)

## Instalación:
- Instalar ffmpeg en Linux:
  - `sudo apt-get install ffmpeg`
- Instalar ffmpeg en Windows:
  - Descargar ffmpeg para Windows: 
  `https://www.ffmpeg.org/download.html#build-windows`
  - Ejecutar el siguiente comando:
  `setx /M PATH "path\to\ffmpeg\bin;%PATH%"`
- Instalar librerias para python:
  - `python3 -m pip install -r requirements.txt`
  
## Más información
Los archivos se almacenan y procesan sobre **_/var/files/files/_** y **_/var/files/downloads/_**
