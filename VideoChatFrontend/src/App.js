import { Routes,Route } from 'react-router-dom';
import './App.css';
// import Home from './routes/Home';
import Blog from './routes/Blog';
import About from './routes/About';
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './LoginSystem/Login';
import Register from './LoginSystem/Register';
import Index from './LoginSystem/Index';
import VideoCallHistory from './LoginSystem/VideoCallHistory';
import Profile from './LoginSystem/Profile';
import Home from './LoginSystem/Home';
import VideoHistoryWithPages from './LoginSystem/VideoHistoryWithPages';

function App() {
  return (

      <Routes>
        <Route path="/" element={<Index/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/video-call-history" element={<VideoCallHistory />} />
      {/* <Route path="/video-call-history" element={<VideoHistoryWithPages />} /> */}
      <Route path="/profile" element={<Profile />} />
      <Route path='/home' element={<Home/>}/>
    </Routes>
  )
}

export default App;
