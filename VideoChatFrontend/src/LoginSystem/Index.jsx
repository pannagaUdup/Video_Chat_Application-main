import React from 'react';
import { Link } from 'react-router-dom';

const Index=()=> {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Welcome to VideoChat Appl</h2>

            <div style={{ marginTop: '20px' }}>
                <p>Registered user? <Link to="/login">Login here</Link></p>
            </div>

            <div style={{ marginTop: '10px' }}>
                <p>New User? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
}

export default Index;
