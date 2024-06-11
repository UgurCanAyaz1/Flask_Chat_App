import json
from flask import Flask, render_template, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
CORS(
    app=app,
    origins="*"
)

socketio = SocketIO(app)

namespace='/api/chat'

@app.route('/')
def chat():
    return render_template('chat.html')

@socketio.on('received_client_message', namespace=namespace)
def message_from_client(data):
    print('received json: ' + str(data))
    
    # The session id of a client to ignore when broadcasting or addressing a room.
    # This is typically set to the originator of the message,
    # so that everyone except that client receive the message
    session_id = request.sid 
    emit('message_from_backend', data, broadcast=True, skip_sid=session_id, namespace=namespace)    

@socketio.on('connection_event', namespace=namespace)
def message_from_client(data):
    print(data)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
