const messageForm = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');
const roomCodeInput = document.getElementById('roomCode');
const createRoomBtn = document.getElementById('createRoom');
const joinRoomBtn = document.getElementById('joinRoom');
const exitRoomBtn = document.getElementById('exitRoom');
const chatBox = document.getElementById('chatBox');

// WebSocket connection
let socket = new WebSocket('ws://localhost:10000');
let currentRoom = null; // Store the current room ID

// Handle incoming messages
socket.onmessage = async function(event) {
    let data = event.data;

    if (data instanceof Blob) {
        data = await data.text();
    }

    try {
        const messageData = JSON.parse(data);
        console.log("Received:", messageData);

        // Check if the message belongs to the current room or is global
        if (messageData.room === currentRoom || (!messageData.room && !currentRoom)) {
            // ✅ Create message container
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            // ✅ Create name element
            const nameElement = document.createElement('strong');
            nameElement.textContent = messageData.name + ": ";
            nameElement.style.color = (messageData.name === userNameInput.value) ? 'blue' : 'red';

            // ✅ Append name and message
            messageElement.appendChild(nameElement);
            messageElement.appendChild(document.createTextNode(messageData.message));

            // ✅ Add message to chat box
            messagesDiv.appendChild(messageElement);
            messagesDiv.style.visibility = 'visible';
            messagesDiv.style.border = '1px solid #ccc';

            // ✅ Auto-scroll to latest message
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    } catch (error) {
        console.error("Invalid JSON received:", data);
    }
};

// Ensure WebSocket is open before sending messages
function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.warn("WebSocket not open. Retrying...");
        setTimeout(() => sendMessage(message), 1000);
    }
}

// Handle WebSocket events
socket.onopen = () => console.log("Connected to WebSocket server.");
socket.onclose = () => console.log("Disconnected from WebSocket server.");
socket.onerror = (error) => console.error("WebSocket Error:", error);

// Store username
let userName = localStorage.getItem('userName') || '';

userNameInput.addEventListener('change', function() {
    userName = userNameInput.value;
    localStorage.setItem('userName', userName);
});

// Send messages
messageForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userMessage = userMessageInput.value.trim();
    if (!userMessage) return;

    const nameToUse = userName || userNameInput.value;

    const messageData = {
        name: nameToUse,
        message: userMessage,
        room: currentRoom // Include the room ID (null for global chat)
    };

    sendMessage(JSON.stringify(messageData));

    userMessageInput.value = '';
});

// ✅ Create Room
createRoomBtn.addEventListener('click', function() {
    const roomCode = roomCodeInput.value.trim();
    if (roomCode.length < 4 || roomCode.length > 6) {
        alert("Room code must be 4-6 digits.");
        return;
    }

    currentRoom = roomCode;
    chatBox.style.backgroundColor = '#f0f8ff'; // Change background color
    exitRoomBtn.style.display = 'inline-block';
    console.log(`Room ${roomCode} created!`);
});

// ✅ Join Room
joinRoomBtn.addEventListener('click', function() {
    const roomCode = roomCodeInput.value.trim();
    if (!roomCode) {
        alert("Enter a valid room code.");
        return;
    }

    currentRoom = roomCode;
    chatBox.style.backgroundColor = '#f0f8ff'; // Change background color
    exitRoomBtn.style.display = 'inline-block';
    console.log(`Joined Room ${roomCode}`);
});

// ✅ Exit Room
exitRoomBtn.addEventListener('click', function() {
    currentRoom = null;
    chatBox.style.backgroundColor = 'white'; // Reset background color
    exitRoomBtn.style.display = 'none';
    console.log("Exited room, back to global chat.");
});
