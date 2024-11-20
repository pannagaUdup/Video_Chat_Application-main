// Login.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//         const response = await fetch('http://localhost:8080/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body: new URLSearchParams({
//                 username,
//                 password,
//             }),
//             credentials: 'include'  // Ensure cookies are sent
//         });

//         if (response.ok) {
//             // If login is successful, navigate to the room
//             const roomUrl = await response.text();  // Get the room URL
//             window.location.href = `http://localhost:8080${roomUrl}`;
//         } else {
//             // Handle login failure
//             const result = await response.text();
//             setError(result);
//         }
//     } catch (error) {
//         console.error('Login failed:', error);
//         setError("An error occurred while trying to log in.");
//     }
// };

//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleSubmit}>
//         <label>Username:</label>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         /><br />

//         <label>Password:</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         /><br />

//         <button type="submit">Login</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <p><a href="/register">Don't have an account? Register here</a></p>
//     </div>
//   );
// };

// export default Login;

// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginCss/Login.css'; // Import the CSS file for styles
import { link } from '../link';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`${link.baseUrl}/login`, {
          // const response = await fetch('http://192.168.68.110:8080/login', {
        method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                username,
                password,
            }),
            credentials: 'include'  // Ensure cookies are sent
        });

        if (response.ok) {
            const roomUrl = await response.text();  // Get the room URL
            console.log(roomUrl)
          //  window.location.href = `http://localhost:8080${roomUrl}`;
           navigate('/home');
        } else {
            const result = await response.text();
            setError(result);
        }
    } catch (error) {
        console.error('Login failed:', error);
        setError("An error occurred while trying to log in.");
    }
};

  return (
    <div className="login-container">
      <h1>VideoChat Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}

      <p><a href="/register">Don't have an account? Register here</a></p>
    </div>
  );
};

export default Login;
