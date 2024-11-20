// let localStream;
// let remoteStream;
// let peerConnection;
// let pendingCandidates = [];
// const socket = new WebSocket("ws://localhost:8080/videoCall");
// socket.onopen = () => {
//     console.log("WebSocket connection established");
// };
// socket.onmessage = (message) => {
//     console.log("Received message: ", message.data);
//     const data = JSON.parse(message.data);
//     switch (data.type) {
//         case 'offer':
//             console.log("Received offer from: ", data.from);
//             receiveCall(data.offer, data.from);
//             break;
//         case 'answer':
//             console.log("Received answer");
//             handleAnswer(data.answer);
//             break;
//         case 'candidate':
//             console.log("Received ICE candidate");
//             handleCandidate(data.candidate);
//             break;
//         default:
//             console.log("Unknown message type: ", data.type);
//             break;
//     }
// };

// function sendMessage(message) {
//     console.log("Sending message: ", message);
//     socket.send(JSON.stringify(message));
// }

// async function startCall(remoteUserId) {
//     try {
//         localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         document.getElementById('localVideo').srcObject = localStream;

//         peerConnection = new RTCPeerConnection({
//             iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//         });

//         localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//         peerConnection.ontrack = (event) => {
//             if (!remoteStream) {
//                 remoteStream = new MediaStream();
//                 document.getElementById('remoteVideo').srcObject = remoteStream;
//             }
//             remoteStream.addTrack(event.track);
//         };

//         peerConnection.onicecandidate = (event) => {
//             if (event.candidate) {
//                 sendMessage({
//                     type: 'candidate',
//                     candidate: event.candidate,
//                     to: remoteUserId
//                 });
//             }
//         };

//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);

//         sendMessage({
//             type: 'offer',
//             offer: offer,
//             to: remoteUserId
//         });
//     } catch (err) {
//         console.error("Error starting call: ", err);
//     }
// }

// async function receiveCall(offer, remoteUserId) {
//     try {
//         if (!localStream) {
//             localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             document.getElementById('localVideo').srcObject = localStream;
//         }

//         peerConnection = new RTCPeerConnection({
//             iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//         });

//         localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//         peerConnection.ontrack = (event) => {
//             if (!remoteStream) {
//                 remoteStream = new MediaStream();
//                 document.getElementById('remoteVideo').srcObject = remoteStream;
//             }
//             remoteStream.addTrack(event.track);
//         };

//         peerConnection.onicecandidate = (event) => {
//             if (event.candidate) {
//                 sendMessage({
//                     type: 'candidate',
//                     candidate: event.candidate,
//                     to: remoteUserId
//                 });
//             }
//         };

//         await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//         pendingCandidates.forEach(candidate => peerConnection.addIceCandidate(new RTCIceCandidate(candidate)));
//         pendingCandidates = [];

//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);

//         sendMessage({
//             type: 'answer',
//             answer: answer,
//             to: remoteUserId
//         });
//     } catch (err) {
//         console.error("Error receiving call: ", err);
//     }
// }

// function handleCandidate(candidate) {
//     if (peerConnection && peerConnection.remoteDescription) {
//         console.log("Adding ICE candidate: ", candidate);
//         peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//             .catch(error => console.error("Error adding ICE candidate:", error));
//     } else {
//         pendingCandidates.push(candidate);
//     }
// }

// function handleAnswer(answer) {
//     console.log("Setting remote description: ", answer);
//     peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
//         .catch(error => console.error("Error setting remote description:", error));
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const roomId = document.querySelector("h1 span") ? document.querySelector("h1 span").innerText : null;
//     if (roomId) {
//         joinCall(roomId);
//     }
// });                //both screen video working codee


// let localStream;
// let remoteStream;
// let peerConnection;
// let pendingCandidates = [];
// const socket = new WebSocket("ws://localhost:8080/videoCall");

// socket.onopen = () => {
//     console.log("WebSocket connection established");

// };

// socket.onmessage = (message) => {
//     console.log("Received message: ", message.data);
//     const data = JSON.parse(message.data);

//     switch (data.type) {
//         case 'offer':
//             console.log("Received offer from: ", data.from);
//             receiveCall(data.offer, data.roomID);
//             break;
//         case 'answer':
//             console.log("Received answer");
//             handleAnswer(data.answer, data.roomID);
//             break;
//         case 'candidate':
//             console.log("Received ICE candidate");
//             handleCandidate(data.candidate, data.roomID);
//             break;
//         case 'join':
//             console.log("User joined room: ", data.roomID);
//             handleJoin(data.roomID);
//             break;
//         case 'call':
//             console.log("Call invitation to room: ", data.roomID);
//             window.location.href = `/room/${data.roomID}`;
//             break;
//         default:
//             console.log("Unknown message type: ", data.type);
//             break;
//     }
// };

// function sendMessage(message) {
//     console.log("Sending message: ", message);
//     socket.send(JSON.stringify(message));
// }

// async function startCall(remoteUserId) {
//     const roomID = `${remoteUserId}-${new Date().getTime()}`;
//     console.log("Creating room: ", roomID);
//     sendMessage({ type: 'call', roomID, to: remoteUserId });
//     window.location.href = `/room/${roomID}`;
// }

// async function joinCall(roomID) {
//     try {
//         if (!localStream) {
//             localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             document.getElementById('localVideo').srcObject = localStream;
//         }

//         if (!peerConnection) {
//             peerConnection = new RTCPeerConnection({
//                 iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//             });

//             localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//             peerConnection.ontrack = (event) => {
//                 if (!remoteStream) {
//                     remoteStream = new MediaStream();
//                     document.getElementById('remoteVideo').srcObject = remoteStream;
//                 }
//                 remoteStream.addTrack(event.track);
//             };

//             peerConnection.onicecandidate = (event) => {
//                 if (event.candidate) {
//                     sendMessage({
//                         type: 'candidate',
//                         candidate: event.candidate,
//                         roomID: roomID
//                     });
//                 }
//             };
//         }

//         if (!peerConnection.localDescription) {
//             const offer = await peerConnection.createOffer();
//             await peerConnection.setLocalDescription(offer);

//             sendMessage({
//                 type: 'offer',
//                 offer: offer,
//                 roomID: roomID
//             });
//         }
        
//     } catch (err) {
//         console.error("Error joining call: ", err);
//     }
// }

// async function handleJoin(roomID) {
//     console.log(`Handling join for roomID: ${roomID}`);
//     window.location.href = `/room/${roomID}`;
// }

// async function receiveCall(offer, roomID) {
//   try {
//       if (!localStream) {
//           localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//           document.getElementById('localVideo').srcObject = localStream;
//       }

//       if (!peerConnection) {
//           peerConnection = new RTCPeerConnection({
//               iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//           });

//           localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//           peerConnection.ontrack = (event) => {
//               if (!remoteStream) {
//                   remoteStream = new MediaStream();
//                   document.getElementById('remoteVideo').srcObject = remoteStream;
//               }
//               remoteStream.addTrack(event.track);
//           };

//           peerConnection.onicecandidate = (event) => {
//               if (event.candidate) {
//                   sendMessage({
//                       type: 'candidate',
//                       candidate: event.candidate,
//                       roomID: roomID
//                   });
//               }
//           };
//       }

//       console.log("Setting remote description state: ", peerConnection.connectionState);
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       console.log("Remote description set state: ", peerConnection.connectionState);
      
//       pendingCandidates.forEach(candidate => peerConnection.addIceCandidate(new RTCIceCandidate(candidate)));
//       pendingCandidates = [];

//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);

//       sendMessage({
//           type: 'answer',
//           answer: answer,
//           roomID: roomID
//       });
//   } catch (err) {
//       console.error("Error receiving call: ", err);
//   }
// }

// function handleCandidate(candidate, roomID) {
//     if (peerConnection && peerConnection.remoteDescription) {
//         console.log("Adding ICE candidate: ", candidate);
//         peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//             .catch(error => console.error("Error adding ICE candidate:", error));
//     } else {
//         pendingCandidates.push(candidate);
//     }
// }


// function handleAnswer(answer, roomID) {
//   console.log("Setting remote description: ", answer);
//   console.log("PeerConnection State: ", peerConnection.connectionState);
//   peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
//       .catch(error => console.error("Error setting remote description:", error));
// }


// document.addEventListener("DOMContentLoaded", () => {
//     const roomIdElement = document.querySelector("h1 span");
//     if (roomIdElement) {
//         const roomId = roomIdElement.innerText;
//         if (roomId) {
//             joinCall(roomId);
//         }
//     }
// });      //both room enter working but boradcating




// let localStream;
// let remoteStream;
// let peerConnection;
// let pendingCandidates = [];
// const socket = new WebSocket("ws://localhost:8080/videoCall");

// socket.onopen = () => {
//     console.log("WebSocket connection established");

// };

// socket.onmessage = (message) => {
//     console.log("Received message: ", message.data);
//     const data = JSON.parse(message.data);

//     switch (data.type) {
//         case 'offer':
//             console.log("Received offer from: ", data.from);
//             receiveCall(data.offer, data.roomID);
//             break;
//         case 'answer':
//             console.log("Received answer");
//             handleAnswer(data.answer, data.roomID);
//             break;
//         case 'candidate':
//             console.log("Received ICE candidate");
//             handleCandidate(data.candidate, data.roomID);
//             break;
//         case 'join':
//             console.log("User joined room: ", data.roomID);
//             handleJoin(data.roomID);
//             break;
//         case 'call':
//             console.log("Call invitation to room: ", data.roomID);
//             window.location.href = `/room/${data.roomID}`;
//             break;
//         default:
//             console.log("Unknown message type: ", data.type);
//             break;
//     }
// };

// function sendMessage(message) {
//     console.log("Sending message: ", message);
//     socket.send(JSON.stringify(message));
// }

// async function startCall(remoteUserId) {
//     const roomID = `${remoteUserId}-${new Date().getTime()}`;
//     console.log("Creating room: ", roomID);
//     sendMessage({ type: 'call', roomID, to: remoteUserId });
//     window.location.href = `/room/${roomID}`;
// }

// async function joinCall(roomID) {
//     try {
//         if (!localStream) {
//             localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             document.getElementById('localVideo').srcObject = localStream;
//         }

//         if (!peerConnection) {
//             peerConnection = new RTCPeerConnection({
//                 iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//             });

//             localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//             peerConnection.ontrack = (event) => {
//                 if (!remoteStream) {
//                     remoteStream = new MediaStream();
//                     document.getElementById('remoteVideo').srcObject = remoteStream;
//                 }
//                 remoteStream.addTrack(event.track);
//             };

//             peerConnection.onicecandidate = (event) => {
//                 if (event.candidate) {
//                     sendMessage({
//                         type: 'candidate',
//                         candidate: event.candidate,
//                         roomID: roomID
//                     });
//                 }
//             };
//         }

//         if (!peerConnection.localDescription) {
//             const offer = await peerConnection.createOffer();
//             await peerConnection.setLocalDescription(offer);

//             sendMessage({
//                 type: 'offer',
//                 offer: offer,
//                 roomID: roomID
//             });
//         }
        
//     } catch (err) {
//         console.error("Error joining call: ", err);
//     }
// }

// async function handleJoin(roomID) {
//     console.log(`Handling join for roomID: ${roomID}`);
//     window.location.href = `/room/${roomID}`;
// }

// async function receiveCall(offer, roomID) {
//   try {
//       if (!localStream) {
//           localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//           document.getElementById('localVideo').srcObject = localStream;
//       }

//       if (!peerConnection) {
//           peerConnection = new RTCPeerConnection({
//               iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//           });

//           localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//           peerConnection.ontrack = (event) => {
//               if (!remoteStream) {
//                   remoteStream = new MediaStream();
//                   document.getElementById('remoteVideo').srcObject = remoteStream;
//               }
//               remoteStream.addTrack(event.track);
//           };

//           peerConnection.onicecandidate = (event) => {
//               if (event.candidate) {
//                   sendMessage({
//                       type: 'candidate',
//                       candidate: event.candidate,
//                       roomID: roomID
//                   });
//               }
//           };
//       }

//       console.log("Setting remote description state: ", peerConnection.connectionState);
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       console.log("Remote description set state: ", peerConnection.connectionState);
      
//       pendingCandidates.forEach(candidate => peerConnection.addIceCandidate(new RTCIceCandidate(candidate)));
//       pendingCandidates = [];

//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);

//       sendMessage({
//           type: 'answer',
//           answer: answer,
//           roomID: roomID
//       });
//   } catch (err) {
//       console.error("Error receiving call: ", err);
//   }
// }

// function handleCandidate(candidate, roomID) {
//     if (peerConnection && peerConnection.remoteDescription) {
//         console.log("Adding ICE candidate: ", candidate);
//         peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//             .catch(error => console.error("Error adding ICE candidate:", error));
//     } else {
//         pendingCandidates.push(candidate);
//     }
// }


// function handleAnswer(answer, roomID) {
//   console.log("Setting remote description: ", answer);
//   console.log("PeerConnection State: ", peerConnection.connectionState);
//   peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
//       .catch(error => console.error("Error setting remote description:", error));
// }


// document.addEventListener("DOMContentLoaded", () => {
//     const roomIdElement = document.querySelector("h1 span");
//     if (roomIdElement) {
//         const roomId = roomIdElement.innerText;
//         if (roomId) {
//             joinCall(roomId);
//         }
//     }
// });      //both room enter working but boradcating



//This is learning about offer and answer

// let localStream
// let remoteStream;
// let peerConnection;
// let pendingCandidates = [];
// const socket = new WebSocket("ws://localhost:8080/videoCall");
// socket.onopen = () => {
//     console.log("WebSocket connection established");
// };
// socket.onmessage = (message) => {
//     console.log("Received message: ", message.data);
//     const data = JSON.parse(message.data);
//     switch (data.type) {
//         case 'offer':
//             console.log("Received offer from: ", data.from);
//             receiveCall(data.offer, data.from);
//             break;
//         case 'answer':
//             console.log("Received answer");
//             handleAnswer(data.answer);
//             break;
//         case 'candidate':
//             console.log("Received ICE candidate");
//             handleCandidate(data.candidate);
//             break;
        
//         default:
//             console.log("Unknown message type: ", data.type);
//             break;
//     }
// };

// function sendMessage(message) {
//     console.log("Sending message: ", message);
//     socket.send(JSON.stringify(message));
// }

// async function startCall(remoteUserId) {
//     try {
//         localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         document.getElementById('localVideo').srcObject = localStream;

//         peerConnection = new RTCPeerConnection({
//             iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//         });

//         localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//         peerConnection.ontrack = (event) => {
//             if (!remoteStream) {
//                 remoteStream = new MediaStream();
//                 document.getElementById('remoteVideo').srcObject = remoteStream;
//             }
//             remoteStream.addTrack(event.track);
//         };

//         peerConnection.onicecandidate = (event) => {
//             if (event.candidate) {
//                 sendMessage({
//                     type: 'candidate',
//                     candidate: event.candidate,
//                     to: remoteUserId
//                 });
//             }
//         };

//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);

//         sendMessage({
//             type: 'offer',
//             offer: offer,
//             to: remoteUserId
//         });
//     } catch (err) {
//         console.error("Error starting call: ", err);
//     }
// }

// async function receiveCall(offer, remoteUserId) {
//     try {
//         if (!localStream) {
//             localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             document.getElementById('localVideo').srcObject = localStream;
//         }

//         peerConnection = new RTCPeerConnection({
//             iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//         });

//         localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//         peerConnection.ontrack = (event) => {
//             if (!remoteStream) {
//                 remoteStream = new MediaStream();
//                 document.getElementById('remoteVideo').srcObject = remoteStream;
//             }
//             remoteStream.addTrack(event.track);
//         };

//         peerConnection.onicecandidate = (event) => {
//             if (event.candidate) {
//                 sendMessage({
//                     type: 'candidate',
//                     candidate: event.candidate,
//                     to: remoteUserId
//                 });
//             }
//         };

//         await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//         pendingCandidates.forEach(candidate => peerConnection.addIceCandidate(new RTCIceCandidate(candidate)));
//         pendingCandidates = [];

//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);

//         sendMessage({
//             type: 'answer',
//             answer: answer,
//             to: remoteUserId
//         });
//     } catch (err) {
//         console.error("Error receiving call: ", err);
//     }
// }

// function handleCandidate(candidate) {
//     if (peerConnection && peerConnection.remoteDescription) {
//         console.log("Adding ICE candidate: ", candidate);
//         peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//             .catch(error => console.error("Error adding ICE candidate:", error));
//     } else {
//         pendingCandidates.push(candidate);
//     }
// }

// function handleAnswer(answer) {
//     console.log("Setting remote description: ", answer);
//     peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
//         .catch(error => console.error("Error setting remote description:", error));
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const roomId = document.querySelector("h1 span") ? document.querySelector("h1 span").innerText : null;
//     if (roomId) {
//         joinCall(roomId);
//     }
// });          //directed session webrtc but offer from sender




// WebSocket logic to handle incoming call notifications for the receiver


// const socket = new WebSocket('ws://localhost:8080/videoCall'); // Update with your WebSocket URL
// socket.onopen = () => {
//     console.log("WebSocket connection established");
// };


// function sendMessage(message) {
//     console.log("Sending message: ", message);
//     socket.send(JSON.stringify(message));
// }


// socket.onmessage = function(event) {
//     const data = JSON.parse(event.data);

//     if (data.type === 'call') {
//         // Display a prompt or alert asking if the receiver wants to join
//         const acceptCall = confirm(`${data.from} is calling you. Do you want to join the room?`);
//         if (acceptCall) {
//             window.location.href = `/user/index?room=${data.roomId}`;
//         }
//     }
// };



// function generateMeetingId() {
//     return 'room_' + Math.random().toString(36).substring(2, 15);
// }

// async function startCall(remoteUserId) {
//     if (roomId) {
//         alert(`Room is already allocated with ID: ${roomId}`);
//         return; // Stop here if roomId is already allocated
//     }
//     // Generate a random invite code
//     let inviteCode = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit invite code
//     alert(`Generated Invite Code: ${inviteCode}`);

//     // const activeUsersList = document.getElementById('active-users-list')
//     // localStorage.setItem('activeUsersList', activeUsersList.innerHTML);
    
//     window.location.href = `/room?room=${inviteCode}`;  
//     sendMessage({
//         type:"call",
//         roomId:meetingId,
//         to:remoteUserId
//     })
// }


