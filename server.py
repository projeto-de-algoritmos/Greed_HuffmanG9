from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from huffman import get_frequencies

socketio = SocketIO()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('solve')
def handle_solve(string):
    get_frequencies(string['word'], socketio)


if __name__ == '__main__':
    socketio.run(app)
