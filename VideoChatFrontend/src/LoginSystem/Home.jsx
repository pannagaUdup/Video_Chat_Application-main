
import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import Member from '../component/Member';
import Profile from './Profile'; // Import the Profile component
import VideoCallHistory from './VideoCallHistory';
import './LoginCss/Home.css';
import { link } from '../link';
import VideoHistoryWithPages from './VideoHistoryWithPages';

const Home = () => {
  const [socket, setSocket] = useState(null);
  const [activeComponent, setActiveComponent] = useState('history'); 
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  

  // WebSocket connection
  useEffect(() => {
    if(!socket){
        const wsUrl = link.baseUrl.replace('http', 'ws')
        const ws = new WebSocket(`${wsUrl}/videoCall`)
        // const ws = new WebSocket('ws://localhost:8080/videoCall'); 
        console.log('websocket connection established')
    
    setSocket(ws);

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);

      if (data.type === 'call') {
        const acceptCall = window.confirm(`${data.from} is calling you. Do you want to join the room?`);
        if (acceptCall) {
          const roomUrl = `${link.baseUrl}/room?room=${data.roomId}`;
          // window.open(roomUrl); 
          window.location.href=roomUrl
        } else {
          ws.send(JSON.stringify({
            type: "reject",
            to: data.from
          }));
        }
      } else if (data.type === 'reject') {
        alert(`${data.from} rejected your invite`);
      }
    };

    // return () => {
    //   if (ws) ws.close();
    // };
    }
  }, [socket]);




  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${link.baseUrl}/profile`, {
          method: 'GET',
          credentials: 'include',  // Include session cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);  // Set the fetched user details to state
        } else {
          const message = await response.text();
          setError(message);
        }
      } catch (error) {
        setError('Error fetching profile');
      }
    };

    fetchProfile(); 
  }, []);

  // Function to render the appropriate component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return <Profile />;
      case 'history':
        return <VideoCallHistory />;
        // return <VideoHistoryWithPages />;

      default:
        return <Profile />;
    }
  };

  return (
    <div className="home-container">
      <Header userName={user.username} setActiveComponent={setActiveComponent} /> {/* Pass the setActiveComponent function */}
      <div id="room__container">
        <Member />
        <div id="stream__container">
          {renderComponent()} {/* This will render either Profile or VideoCallHistory */}
        </div>
      </div>
    </div>
  );
};

export default Home;


