const messageForm = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');

let socket = new WebSocket('ws://localhost:10000');

let messagesArray = JSON.parse(localStorage.getItem("chatMessages")) || [];

// ✅ Load stored messages on page load
function updateMessagesUI() {
    messagesDiv.innerHTML = "";

    if (messagesArray.length === 0) {
        messagesDiv.style.visibility = "hidden"; 
        messagesDiv.style.border = "none";
    } else {
        messagesDiv.style.visibility = "visible"; 
        messagesDiv.style.border = "1px solid #ccc";
    }

    messagesArray.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        const nameElement = document.createElement('strong');
        nameElement.textContent = msg.name + ": ";
        nameElement.style.color = 'red';

        messageElement.appendChild(nameElement);
        messageElement.appendChild(document.createTextNode(msg.message));
        messagesDiv.appendChild(messageElement);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight; 
}

// ✅ Correctly store the user's name
userNameInput.addEventListener('change', function () {
    localStorage.setItem('userName', userNameInput.value);
});

// ✅ Handle incoming messages
socket.onmessage = async function(event) {
    let data = event.data;

    if (data instanceof Blob) {
        data = await data.text();
    }

    try {
        const messageData = JSON.parse(data);
        console.log("Received:", messageData);

        messagesArray.push(messageData);

        if (messagesArray.length > 20) {
            messagesArray.shift(); 
        }

        localStorage.setItem("chatMessages", JSON.stringify(messagesArray));

        updateMessagesUI();
    } catch (error) {
        console.error("Invalid JSON received:", data);
    }
};

// ✅ Send messages with correct user name
messageForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userMessage = userMessageInput.value.trim();
    if (!userMessage) return;

    // ✅ Get the correct name
    let userName = userNameInput.value.trim() || localStorage.getItem('userName') || "Anonymous";

    const messageData = JSON.stringify({ name: userName, message: userMessage });

    socket.send(messageData);
    userMessageInput.value = '';
});
