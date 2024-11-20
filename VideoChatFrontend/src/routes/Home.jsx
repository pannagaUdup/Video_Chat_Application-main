import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    // navigate("/blog");
    navigate('/blog', { state: { datas: "jdbhcfjhs" } });
  }

  const handleAboutClick = () => {
    // navigate("/blog");
    navigate('/about', { state: { datas: "jdbhcfjhs" } });
  }

  return (
    <div style={{ marginTop: "20px", display: "flex", padding: "40px" }}>
      <h1>Home</h1>
      <Button onClick={handleClick} variant='contained' color='primary'>Go To Blog</Button>
      <Button onClick={handleAboutClick} variant='contained' color='primary'>About</Button>

    </div>
  )
}

export default Home