let username = '';

function setUsername() {
    const input = document.getElementById('username-input');
    username = input.value.trim();
    if (username === '') return;

    document.getElementById('chat-input').disabled = false;
    document.getElementById('input-container').querySelector('button').disabled = false;
    input.disabled = true;
    document.getElementById('username-container').querySelector('button').disabled = true;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '') return;
    console.log(`Client's SID: ${socket.id}`);
    addMessage('user', `${username}: ${message}`);
    input.value = '';

    // Emit the message to the server
    socket.emit('received_client_message', { client_id :socket.id, username: username, message: message });
}

function addMessage(sender, text) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = text;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

var socket = io('/api/chat');
socket.on('connect', function() {
    console.log(`Connected with SID: ${socket.id}`);
    socket.emit('connection_event', { 'client_id' :socket.id , 'message': 'Client is connected!' });
});

// Set up the event listener for the backend messages
socket.on('message_from_backend', function(data) {
    console.log(data);
    addMessage('bot', `${data.username}: ${data.message}`);
});
