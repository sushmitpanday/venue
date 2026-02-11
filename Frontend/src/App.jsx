import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import UserRegister from './Pages/Auth/UserRegister';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import OwnerDashboard from './components/OwnerDashboard';
import VenueDetial from './components/VenueDetial';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout';

// --- AGENT IMPORTS ---
import AgentLogin from './components/AgentLogin'; 
import AgentRegister from './components/AgentRegister';
import AgentDashboard from './components/AgentDashboard'; // <-- NAYA IMPORT (Path check kar lena)

const AppContent = () => {
  const location = useLocation();
  
  const hideLayout = [
    '/login', 
    '/register', 
    '/owner-dashboard', 
    '/admin-dashboard', 
    '/checkout',
    '/agent-login',
    '/agent-register',
    '/agent-dashboard' // Dashboard par Header/Footer nahi chahiye
  ];
  
  const isCleanPage = hideLayout.includes(location.pathname);

  return (
    <div className="app-container">
      {!isCleanPage && (
        <>
          <Header />
          <Hero />
        </>
      )}

      <main className="main-content">
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/agent-login" element={<AgentLogin />} />
          <Route path="/agent-register" element={<AgentRegister />} />

          {/* DASHBOARD ROUTES */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard/>}/>
          
          {/* YAHAN BADLAV KIYA GAYA HAI */}
          <Route path="/agent-dashboard" element={<AgentDashboard />} /> 

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<UserRegister />} />
          <Route path="/venue/:id" element={<VenueDetial />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      {!isCleanPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;