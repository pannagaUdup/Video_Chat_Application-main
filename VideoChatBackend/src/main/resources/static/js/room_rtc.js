const APP_ID="enter your Agora ID";

const link= "http://"

let uid = sessionStorage.getItem('uid'); // Enter username
if (!uid) {
    uid = String(Math.floor(Math.random() * 10000));
    sessionStorage.setItem('uid', userId);
}

let token = null;
let client;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get('room');

let localTracks = [];
let remoteUsers = {};


const createOrJoinRoomAPI = async (roomCode, userId) => {
    try {
        const response = await fetch(`/api/createOrJoinRoom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomCode, userId })
        });

        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }
        console.log(`User ${userId} has successfully joined or created room ${roomCode}`);
    } catch (error) {
        console.error('Error during createOrJoinRoom API call:', error);
    }
};

// API function to leave room
const leaveRoomAPI = async (roomCode, userId) => {
    try {
        const response = await fetch(`/api/leaveRoom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomCode, userId })
        });

        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }
        console.log(`User ${userId} has left room ${roomCode}`);
    } catch (error) {
        console.error('Error during leaveRoom API call:', error);
    }
};



let init = () => {
    if (!roomId) {
        console.log('No room ID allocated');
        return;
    }
    document.getElementById('copyRoomLink').style.display='block'

    createOrJoinRoomAPI(roomId, uid);

    let joinRoomInit = async () => {
        client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});
        await client.join(APP_ID, roomId, token, uid);

        client.on('user-published', handleUserPublished);
        client.on('user-left', handleUserLeft);

        joinStream();
    };

    let joinStream = async () => {
        localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {
            encoderConfig: {
                width: {min: 640, ideal: 1920, max: 1920},
                height: {min: 480, ideal: 1080, max: 1080}
            }
        });

        let player = `<div class="video__container" id="user-container-${uid}">
                        <div class="video-player" id="user-${uid}"></div>
                        <p class="user-id"> ${uid}</p>
                      </div>`;
        document.getElementById('streams__container').insertAdjacentHTML('beforeend', player);

        document.getElementById(`user-container-${uid}`).addEventListener('click',expandVideoFrame)

        localTracks[1].play(`user-${uid}`);
        await client.publish([localTracks[0], localTracks[1]]);
    };
    
    joinRoomInit();
};

let handleUserPublished = async (user, mediaType) => {
    remoteUsers[user.uid] = user;
    await client.subscribe(user, mediaType);

    let player = document.getElementById(`user-container-${user.uid}`);
    if (!player) {
        player = `<div class="video__container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-${user.uid}"></div>
                    <p class="user-id"> ${user.uid}</p>
                  </div>
                  `;
        document.getElementById('streams__container').insertAdjacentHTML('beforeend', player);
        document.getElementById(`user-container-${user.uid}`).addEventListener('click',expandVideoFrame)
 
    }
    if(displayFrame.style.display){
        let videoFrame = document.getElementById(`user-container-${user.uid}`)
        videoFrame.style.height='100px';
        videoFrame.style.width='100px';
    }

    if (mediaType === 'video') {
        user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === 'audio') {
        user.audioTrack.play();
    }

};

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();

    if(userIdInDisplayFrame === `user-container-${user.uid}`){
        displayFrame.style.display = null
        
        let videoFrames = document.getElementsByClassName('video__container')

        for(let i = 0; videoFrames.length > i; i++){
            videoFrames[i].style.height = '220px'
            videoFrames[i].style.width = '220px'
        }
    }
};


let toggleCamera = async (e) => {
    let button = e.currentTarget;

    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false);
        button.classList.add('active');
    } else {
        await localTracks[1].setMuted(true);
        button.classList.remove('active');
    }
};

// Toggle microphone
let toggleMic = async (e) => {
    let button = e.currentTarget;

    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false);
        button.classList.add('active');
    } else {
        await localTracks[0].setMuted(true);
        button.classList.remove('active');
    }
};

let leaveStream = async (e) => {
    e.preventDefault()

    // document.getElementById('join-btn').style.display = 'block'
    // document.getElementsByClassName('stream__actions')[0].style.display = 'none'

    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.unpublish([localTracks[0], localTracks[1]])

    // if(localScreenTracks){
    //     await client.unpublish([localScreenTracks])
    // }

    document.getElementById(`user-container-${uid}`).remove()

    if(userIdInDisplayFrame === `user-container-${uid}`){
        displayFrame.style.display = null
        // let videoFrames=document.getElementsByClassName('video__container')

        for(let i = 0; videoFrames.length > i; i++){
            videoFrames[i].style.height = '300px'
            videoFrames[i].style.width = '300px'
        }
    }
    // client.sendMessage({text:JSON.stringify({'type':'user-left', 'uid':uid})})
    await client.leave();
    await leaveRoomAPI(roomId, uid);

    streamActions.style.display = 'none'; 

    // window.location.href = `/user/room`;
    window.location.href = `${reactUrl}/home`;
}

const socketUrl = window.location.origin.replace('http', 'ws'); 
// const socket = new WebSocket(`ws://localhost:8080/videoCall`); 
const socket = new WebSocket(`${socketUrl}/videoCall`); // Update with your WebSocket URL


socket.onopen = () => {
    console.log("WebSocket connection established");
};


function sendMessage(message) {
    console.log("Sending message: ", message);
    socket.send(JSON.stringify(message));
}


socket.onmessage = function(event) {
    const data = JSON.parse(event.data);

    if (data.type === 'call') {
        console.log('received message from panna')
        // Display a prompt or alert asking if the receiver wants to join
        const acceptCall = confirm(`${data.from} is calling you. Do you want to join the room?`);
        if (acceptCall) {
            window.location.href = `/room?room=${data.roomId}`;
        }
        else{
            sendMessage({  
                type:"reject",
                to:data.from
            })
        }
    }
    else if(data.type==='reject'){
        alert(`${data.from} rejected your invite`)
    }
};




async function startCall(remoteUserId) {
    if (roomId) {
        // alert(`Room is already allocated with ID: ${roomId}`);
        console.log('sending message to ',remoteUserId)
        sendMessage({
            type:"call",
            roomId:roomId,
            to:remoteUserId
        })
        return; // Stop here if roomId is already allocated
    }
    // Generate a random invite code
    let inviteCode = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit invite code
    alert(`Generated Invite Code: ${inviteCode}`);

    // const activeUsersList = document.getElementById('active-users-list')
    // localStorage.setItem('activeUsersList', activeUsersList.innerHTML);
    console.log('sending message to ',remoteUserId)
    sendMessage({
        type:"call",
        roomId:inviteCode,
        to:remoteUserId
    })

    window.location.href = `/room?room=${inviteCode}`;  
}



window.onload = function () {

    if(roomId){
    streamActions.style.display = 'flex';
    }

    document.getElementById('camera-btn').addEventListener('click', toggleCamera);
    document.getElementById('mic-btn').addEventListener('click', toggleMic);
    document.getElementById('leave-btn').addEventListener('click', leaveStream)


    // document.getElementById('generateInviteButton').addEventListener('click', () => {
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
    // });

    
    init(); // Initialize after everything is loaded
};


