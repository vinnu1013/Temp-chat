const messageForm = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');

let socket = new WebSocket('wss://temp-chat-sfww.onrender.com'); // Use "wss://" for secure WebSocket

// Handle incoming messages
socket.onmessage = async function(event) {
    let data = event.data;

    if (data instanceof Blob) {
        data = await data.text(); // Convert Blob to text
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

// ✅ Ensure the WebSocket is open before sending messages
function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.warn("WebSocket is not open. Retrying in 1 second...");
        setTimeout(() => sendMessage(message), 1000);
    }
}

// Handle connection events
socket.onopen = () => console.log("Connected to WebSocket server.");
socket.onclose = () => console.log("Disconnected from WebSocket server.");
socket.onerror = (error) => console.error("WebSocket Error:", error);

// Retrieve user name from local storage
let userName = localStorage.getItem('userName') || '';

userNameInput.addEventListener('change', function() {
    userName = userNameInput.value;
    localStorage.setItem('userName', userName);
});

// ✅ Prevent empty messages & ensure WebSocket is open
messageForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userMessage = userMessageInput.value.trim();
    if (!userMessage) return; // Prevent sending empty messages

    const nameToUse = userName || userNameInput.value; // Use stored or input name

    const messageData = JSON.stringify({ name: nameToUse, message: userMessage });

    sendMessage(messageData); // ✅ Send message only when WebSocket is ready

    // Clear input field
    userMessageInput.value = '';
});
