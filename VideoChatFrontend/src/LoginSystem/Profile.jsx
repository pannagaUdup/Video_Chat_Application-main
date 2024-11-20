// import React, { useState, useEffect } from 'react';

// const Profile = () => {
//   const [user, setUser] = useState({});
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/profile', {
//           method: 'GET',
//           credentials: 'include',  // Include session cookies
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUser(data);  // Set the fetched user details to state
//         } else {
//           const message = await response.text();
//           setError(message);
//         }
//       } catch (error) {
//         setError('Error fetching profile');
//       }
//     };

//     fetchProfile(); 
//   }, []);

//   // Display error if there's an issue
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>User Profile</h2>
//       {user ? (
//         <div>
//           <p><strong>User ID:</strong> {user.id}</p>
//           <p><strong>First Name:</strong> {user.firstName}</p>
//           <p><strong>Last Name:</strong> {user.lastName}</p>
//           <p><strong>Username:</strong> {user.username}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//         </div>
//       ) : (
//         <p>Loading profile...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import './LoginCss/Profile.css'; // Import the CSS for styling
import { link } from '../link';

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');

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

  // Display error if there's an issue
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user ? (
        <div className="profile-card">

          {/* User Information */}
          <div className="profile-details">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
