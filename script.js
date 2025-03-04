const messageForm = document.getElementById('messageForm');
const socket = new WebSocket('ws://localhost:8080'); // Connect to WebSocket server

socket.onmessage = function(event) {
    const messageData = JSON.parse(event.data);
    const messageElement = document.createElement('div');
    const nameElement = document.createElement('div');
    nameElement.textContent = messageData.name;
    nameElement.style.color = 'red'; // Set name color to red
    messageElement.appendChild(nameElement);
    messageElement.appendChild(document.createTextNode(messageData.message));
    
    messagesDiv.appendChild(messageElement);
};

let userName = '';
const userNameInput = document.getElementById('userName');

userNameInput.addEventListener('change', function() {
    userName = userNameInput.value;
});

const userMessageInput = document.getElementById('userMessage');
const messagesDiv = document.getElementById('messages');

messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userMessage = userMessageInput.value;
    const nameToUse = userName || userNameInput.value; // Use stored name or input name

    // Send message to WebSocket server
    socket.send(JSON.stringify({ name: nameToUse, message: userMessage }));


    const messageElement = document.createElement('div');
    const nameElement = document.createElement('div');
    nameElement.textContent = nameToUse;
    nameElement.style.color = 'red'; // Set name color to red
    messageElement.appendChild(nameElement);
    messageElement.appendChild(document.createTextNode(userMessage));

    messagesDiv.appendChild(messageElement);
    
    userMessageInput.value = '';
    

});
