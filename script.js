const messageForm = document.getElementById('messageForm');
 // Connect to WebSocket server
const socket = new WebSocket('wss://temp-chat-sfww.onrender.com'); 


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

let userName = localStorage.getItem('userName') || ''; // Retrieve user name from local storage

const userNameInput = document.getElementById('userName');

userNameInput.addEventListener('change', function() {
    userName = userNameInput.value;
    localStorage.setItem('userName', userName); // Store user name in local storage

});

const userMessageInput = document.getElementById('userMessage');
const messagesDiv = document.getElementById('messages');

messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userMessage = userMessageInput.value;
    const nameToUse = userName || userNameInput.value; // Use stored name or input name

    // Send message to WebSocket server
    socket.send(JSON.stringify({ name: nameToUse, message: userMessage }));


    // Remove local message creation logic

    
    userMessageInput.value = '';
    

});
