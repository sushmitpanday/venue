import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero'
import VenueManager from './components/VenueManager';
import UserRegister from './Pages/Auth/UserRegister';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';


function App() {
  return (
    <Router>
      <Header/>
      <Hero/>
      <VenueManager/>
        <Routes>
         <Route path="/register" element={<Register />} />
         <Route path="/login" element={<Login />} />
         <Route path="/" element={<UserRegister />} />
         

          
        </Routes>
        <Footer/>
      
    </Router>
  );
}

export default App;