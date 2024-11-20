// // websocketManager.js
// let socket = null;
// const broadcastChannel = new BroadcastChannel('websocket-channel');

// const createSocket = () => {
//     if (!socket) {
//         socket = new WebSocket('ws://localhost:8080/videoCall');

//         socket.onopen = () => {
//             console.log("WebSocket connection established");
//         };

//         socket.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             console.log("WebSocket message received:", data);
//             broadcastMessage(data); // Broadcast the message to other tabs
//         };

//         socket.onclose = () => {
//             console.log("WebSocket connection closed");
//             socket = null;
//         };
//     }
// };

// broadcastChannel.onmessage = (event) => {
//     try {
//         const data = JSON.parse(event.data); // Ensure proper parsing

//         if (data.type === 'send') {
//             socket.send(JSON.stringify(data.message));
//         } else if (data.type === 'close') {
//             socket.close();
//         }
//     } catch (error) {
//         console.error("Failed to parse message:", event.data); // Log the invalid data
//     }
// };

// const broadcastMessage = (message) => {
//     broadcastChannel.postMessage(JSON.stringify(message)); // Ensure message is stringified
// };

// export const WebSocketManager = {
//     createSocket,
//     sendMessage: (message) => {
//         if (socket && socket.readyState === WebSocket.OPEN) {
//             socket.send(JSON.stringify(message));
//         } else {
//             broadcastChannel.postMessage(JSON.stringify({ type: 'send', message }));
//         }
//     },
//     closeSocket: () => {
//         if (socket) {
//             socket.close();
//         }
//         broadcastChannel.postMessage(JSON.stringify({ type: 'close' }));
//     },
// };
