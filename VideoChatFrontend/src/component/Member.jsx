import React, { useEffect, useState } from 'react';
import './css/memberContainer.css'; // Assuming you'll add the related CSS in a file
import { link } from '../link';

const Member = () => {
    const [activeUsers, setActiveUsers] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');



    const fetchActiveUsers = async () => {
        try {
          const response = await fetch(`${link.baseUrl}/api/get-active-users`); 
          if (response.ok) {
            const data = await response.json();
            setActiveUsers(data);
            console.log(data);
          } else {
            console.error('Failed to fetch active users');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    useEffect(() => {
        fetchActiveUsers();
      }, [activeUsers.length]);

    const generateInvite = async () => {
        // Generate a random invite code
        const inviteCode = Math.floor(100000 + Math.random() * 900000).toString();  // Random 6-digit invite code
    
        try {
          const roomUrl = `${link.baseUrl}/room?room=${inviteCode}`;
          window.location.href=roomUrl
          // window.open(roomUrl);  // Open the room page in a new tab
        } catch (error) {
          console.error('Error generating invite code:', error);
        }
      };


      const joinRoom = async () => {
        if (!roomId) {
          setErrorMessage("Please enter a Room ID");
          return;
        }
        try {
          const response = await fetch(`/api/joinRoom`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId }),
          });
    
          if (response.ok) {
            const data = await response.json();
            if (data.roomExists) {
              // If room exists, open a new tab with the room
              const roomUrl = `${link.baseUrl}/room?room=${roomId}`;
                window.open(roomUrl, '_blank');
            //   window.open(`/room?room=${roomId}`, '_blank');
            } else {
              setErrorMessage("No room found with the entered Room ID.");
            }
          } else {
            setErrorMessage("Failed to join the room.");
          }
        } catch (error) {
          console.error("Error joining the room:", error);
          setErrorMessage("An error occurred. Please try again.");
        }
      };


  return (
    <section id="members__container">
      <div>
        <button id="generateInviteButton" onClick={generateInvite}>Start Video Call</button>
      </div> 
      <div>
        <input 
          type="text" 
          placeholder="Enter Room ID" 
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)} 
        />
        <button onClick={joinRoom}>Join Room</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>

      <div>
        <button id="refreshActiveUsers" onClick={fetchActiveUsers}>🔄 Refresh</button>
        <div>Active Users</div>
      </div>
      <div id="active-users-list">
        {activeUsers.map((user) => (
          <div key={user.id} className="active-user">
            {user.username}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Member;
