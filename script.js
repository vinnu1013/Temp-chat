const messageForm = document.getElementById('messageForm');
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');
const messagesDiv = document.getElementById('messages');

messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userName = userNameInput.value;
    const userMessage = userMessageInput.value;
    
    const messageElement = document.createElement('div');
    messageElement.textContent = `${userName}: ${userMessage}`;
    messagesDiv.appendChild(messageElement);
    
    userNameInput.value = '';
    userMessageInput.value = '';
    
    setTimeout(() => {
        messagesDiv.removeChild(messageElement);
    }, 300000); // Remove message after 5 minutes
});
