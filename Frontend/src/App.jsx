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
import AdminDashboard from './components/AdminDashboard';

const AppContent = () => {
  const location = useLocation();
  
  // YAHAN BADLAV KIYA HAI: Admin Dashboard ka path bhi add kar diya
  const hideLayout = ['/login', '/register', '/owner-dashboard', '/admin-dashboard'];
  
  const isCleanPage = hideLayout.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Agar Clean Page nahi hai, tabhi Header aur Hero dikhega */}
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
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<UserRegister />} />
          <Route path="/venue/:id" element={<VenueDetial />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard/>}/>
        </Routes>
      </main>

      {/* Footer bhi hideLayout wali pages par nahi dikhega */}
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