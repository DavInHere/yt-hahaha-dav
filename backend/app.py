# app.py

from flask import Flask, render_template, request
from pytube import YouTube
import os

app = Flask(__name__)

# Mendapatkan direktori unduhan default pada sistem
def get_default_download_dir():
    if os.name == 'nt':  # Windows
        return os.path.join(os.path.expanduser("~"), "Downloads")
    else:  # Mac/Linux
        return os.path.join(os.path.expanduser("~"), "Downloads")

# Halaman utama dengan formulir untuk memasukkan URL video
@app.route('/')
def index():
    return render_template('index.html')

# Menangani permintaan unduhan
@app.route('/download', methods=['POST'])
def download():
    url = request.form['url']
    try:
        yt = YouTube(url)
        video_title = yt.title
        video_stream = yt.streams.get_highest_resolution()
        file_path = os.path.join(get_default_download_dir(), f"{video_title}.mp4")
        video_stream.download(output_path=get_default_download_dir(), filename=video_title)
        return render_template('download.html', video_title=video_title)
    except Exception as e:
        return render_template('error.html', error=str(e))

if __name__ == '__main__':
    app.run(debug=True)
