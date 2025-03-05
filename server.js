const WebSocket = require('ws');

const PORT = process.env.PORT || 10000; // Use the PORT environment variable or fallback to 10000
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server is running on port ${PORT}`);
