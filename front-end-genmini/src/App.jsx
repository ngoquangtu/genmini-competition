import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import FeedBack from './components/FeedBack';
import ChatApp from './components/ChatApp';
function App() {
    return (
      <Router>
            <div>
              <NavBar/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<ChatApp/>} />
                    <Route path="/report" element={<FeedBack/>} />
                </Routes>

            </div>
            <Footer />
        </Router>
        
    );
}

export default App;