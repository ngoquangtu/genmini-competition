import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import FeedBack from './components/FeedBack';
import ChatBot from './components/ChatBot';
import ChatApp from './components/ChatApp';
function App() {
    return (
      <Router>
            <div>
              <NavBar/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<ChatBot/>} />
                    <Route path="/report" element={<FeedBack/>} />
                    <Route path="/chat1" element={<ChatApp/>} />
                </Routes>

            </div>
            <Footer />
        </Router>
        
    );
}

export default App;