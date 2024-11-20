
// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginCss/Register.css'; // Import the CSS file for styles
import { link } from '../link';

const Register = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });
    const [maxLengthReached,setmaxLengthReached]=useState(false)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
            if(e.target.value.length>30){
                setmaxLengthReached(true)
            }
            else{
                setmaxLengthReached(false)
            }
        
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${link.baseUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(userData),
                credentials: 'include'  // Include session data
            });

            if (response.ok) {
                const loginUrl = await response.text(); // Assuming the backend sends the login URL
                // window.location.href = loginUrl;
                navigate('/login')
            } else {
                const result = await response.text();
                setError(result);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setError("An error occurred while registering.");
        }
    };

    return (
        <div className="register-container">
            <h2>VideoChat Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="firstName" 
                    value={userData.firstName} 
                    onChange={handleInputChange} 
                    placeholder="First Name" 
                    maxLength={31} 
                    required
                />
                <input 
                    type="text" 
                    name="lastName" 
                    value={userData.lastName} 
                    onChange={handleInputChange} 
                    placeholder="Last Name"
                    maxLength={31} 
                    required
                /> 
                <input 
                    type="text" 
                    name="username" 
                    value={userData.username} 
                    onChange={handleInputChange} 
                    placeholder="Username" 
                    maxLength={31} 
                    required
                />
                <input 
                    type="email" 
                    name="email" 
                    value={userData.email} 
                    onChange={handleInputChange} 
                    placeholder="Email" 
                    maxLength={31} 
                    required
                />
                <input 
                    type="password" 
                    name="password" 
                    value={userData.password} 
                    onChange={handleInputChange} 
                    placeholder="Password" 
                    minLength={8}
                    maxLength={31} 
                    required
                />
                {maxLengthReached && <p style={{ color: 'red' }}>Maximum length reached!</p>}
                <button type="submit">Register</button>
            </form>
            {error && <p className="error-message">{error}</p>}

            {/* Already a user? Section */}
            <div>
                <p>Already a user?</p>
                <p><a href="/login">Login here</a></p>
            </div>
        </div>
    );
};

export default Register;
