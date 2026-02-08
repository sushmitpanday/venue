import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero'
import UserRegister from './Pages/Auth/UserRegister';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import OwnerDashboard from './components/OwnerDashboard';
import VenueDetial from './components/VenueDetial';

// Layout Manager Component
const AppContent = () => {
  const location = useLocation();
  
  // In pages par Header, Hero, VenueManager aur Footer kuch nahi dikhega
  const hideLayout = ['/login', '/register', '/owner-dashboard'];
  const isCleanPage = hideLayout.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Agar Clean Page nahi hai, tabhi ye sab dikhao */}
      {!isCleanPage && (
        <>
          <Header />
          <Hero />
        
        </>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<UserRegister />} />
          <Route path="/venue/:id" element={<VenueDetial />} />
          {/* Kal ko owner dashboard yahan aayega */}
          <Route path="/owner-dashboard" element={<OwnerDashboard/>}/>
        </Routes>
      </main>

      {/* Footer condition: Sirf tab dikhega jab login/register page na ho */}
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