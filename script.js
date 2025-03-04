const messageForm = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');

// Connect to WebSocket server
const socket = new WebSocket('wss://temp-chat-sfww.onrender.com');

// Handle incoming messages
socket.onmessage = async function(event) {
    let data = event.data;

    // Convert Blob to JSON text if necessary
    if (data instanceof Blob) {
        data = await data.text();
    }

    try {
        const messageData = JSON.parse(data);
        console.log("Received:", messageData);

        // Create message container
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        // Create name element
        const nameElement = document.createElement('strong');
        nameElement.textContent = messageData.name + ": ";
        nameElement.style.color = 'red';

        // Append name and message
        messageElement.appendChild(nameElement);
        messageElement.appendChild(document.createTextNode(messageData.message));
        messagesDiv.appendChild(messageElement);

        // Auto-scroll to latest message
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
        console.error("Invalid JSON received:", data);
    }
};

// Retrieve user name from local storage
let userName = localStorage.getItem('userName') || '';

userNameInput.addEventListener('change', function() {
    userName = userNameInput.value;
    localStorage.setItem('userName', userName);
});

// Handle message submission
messageForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userMessage = userMessageInput.value.trim();
    if (!userMessage) return; // Prevent sending empty messages

    const nameToUse = userName || userNameInput.value; // Use stored or input name

    // Send message to WebSocket server
    socket.send(JSON.stringify({ name: nameToUse, message: userMessage }));

    // Clear input field
    userMessageInput.value = '';
});
