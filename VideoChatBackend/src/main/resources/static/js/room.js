// document.addEventListener("DOMContentLoaded", function() {
//   fetchActiveUsers();
// });

// let fetchActiveUsers = async () => {
//   try {
//       const response = await fetch('/api/active-users'); // Call the backend API to get active users
//       const activeUsers = await response.json();
//       populateActiveUsersList(activeUsers);
//   } catch (error) {
//       console.error("Failed to fetch active users", error);
//   }
// };

// let populateActiveUsersList = (activeUsers) => {
//   const userList = document.getElementById('active-users-list');
//   userList.innerHTML = '';  // Clear existing list

//   activeUsers.forEach(user => {
//       const listItem = document.createElement('li');
//       listItem.innerHTML = `<span>${user.username}</span><button onclick="startCall('${user.username}')">Call</button>`;
//       userList.appendChild(listItem);
//   });
// };

// document.addEventListener('DOMContentLoaded', () => {
//   const generateInviteButton = document.getElementById('generateInviteButton');

//   generateInviteButton.addEventListener('click', () => {
//       // Generate a unique room ID
//       const inviteCode = String(Math.floor(Math.random() * 10000));
//       alert(`Invite Code: ${inviteCode}`);

//       // Save the active users to localStorage


//       // Redirect or update the page as needed
//   });

//   // Load the active users from localStorage
//   const activeUsersList = localStorage.getItem('activeUsersList');
//   if (activeUsersList) {
//       document.getElementById('active-users-list').innerHTML = activeUsersList;
//   }
// });

let displayFrame = document.getElementById('stream__box')
let videoFrames = document.getElementsByClassName('video__container')
let userIdInDisplayFrame = null;

let expandVideoFrame = (e)=>{
    let child = displayFrame.children[0]
    if(child){
        document.getElementById('streams__container').appendChild(child)
    }
    displayFrame.style.display = 'block'
    displayFrame.appendChild(e.currentTarget)
    userIdInDisplayFrame = e.currentTarget.id

    for(let i=0;videoFrames.length>i;i++){
        if(videoFrames[i].id!=userIdInDisplayFrame)
        {
            videoFrames[i].style.height='150px'
            videoFrames[i].style.width='150px'
        }
    }
}

for(let i=0;videoFrames.length>i;i++){
    videoFrames[i].addEventListener('click',expandVideoFrame)
}

let hideDisplayFrame = ()=>{
    userIdInDisplayFrame = null
    displayFrame.style.display = null

    let child = displayFrame.children[0]
    document.getElementById('streams__container').appendChild(child)
    for(let i = 0; videoFrames.length > i; i++){
        videoFrames[i].style.height = '300px'
        videoFrames[i].style.width = '300px'
    }
}

displayFrame.addEventListener('click',hideDisplayFrame)