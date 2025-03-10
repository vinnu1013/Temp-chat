const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 10000 });

let clients = [];

server.on('connection', (socket) => {
    console.log("Client connected");
    clients.push(socket);

    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        
        // ✅ Broadcast message only to users in the same room
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    });

    socket.on('close', () => {
        clients = clients.filter(client => client !== socket);
        console.log("Client disconnected");
    });
});

console.log("WebSocket server is running on ws://localhost:10000");
