import React from 'react';
import './css/header.css';
import { redirect,useNavigate } from 'react-router-dom';
import { link } from '../link';

const Header = ({ userName, setActiveComponent }) => {
    const navigate=useNavigate()
  const logoutfunc = async ()=>{
    try {
        const response= await fetch(`${link.baseUrl}/logout-react`,{
        method:'GET',
        credentials: 'include'
        })

        if(response.ok){
            navigate('/'); 
        }
        else{
            console.error('Logout Failed')
        }
    } catch (error) {
        console.log('error during logout ',error)
    }
  }

  return (
    <header>
      <nav className="header__nav">
        <h1>Welcome to the home page</h1>
        <p>Welcome, <strong id="userName">{userName}</strong>!</p>
        <ul>
          <li><button onClick={() => setActiveComponent('profile')} className="link-button">Profile</button></li>
          <li><button onClick={() => setActiveComponent('history')} className="link-button">Chat History</button></li>
          <li><button onClick={logoutfunc} className="link-button">Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

