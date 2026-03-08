import React, { Suspense, lazy, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// 1. Static Imports
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';

// 2. Lazy Imports
const UserRegister = lazy(() => import('./Pages/Auth/UserRegister'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const OwnerDashboard = lazy(() => import('./components/OwnerDashboard'));
const VenueDetial = lazy(() => import('./components/VenueDetial'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Checkout = lazy(() => import('./components/Checkout'));
const UserBooking = lazy(() => import('./components/UserBooking')); 
const PaymentSuccess = lazy(() => import('./components/PaymentSuccess')); 
const AgentLogin = lazy(() => import('./components/AgentLogin')); 
const AgentRegister = lazy(() => import('./components/AgentRegister'));
const AgentDashboard = lazy(() => import('./components/AgentDashboard')); 
const Terms = lazy(() => import('./components/Terms'));
const Privacy = lazy(() => import('./components/Privacy')); 
const Shipping = lazy(() => import('./components/Shipping'));
const About = lazy(() => import('./components/Aboutus')); 
// --- CONTACT US LAZY IMPORT ---
const ContactUs = lazy(() => import('./components/Contactus')); 

// 3. Constant Paths
const HIDE_LAYOUT_PATHS = [
  '/login', '/register', '/owner-dashboard', '/admin-dashboard', 
  '/checkout', '/agent-login', '/agent-register', '/agent-dashboard',
  '/user-dashboard', '/paymentsuccess', '/terms', '/privacy', '/shipping',
  '/about', 
  '/contact' // --- ADDED TO HIDE GLOBAL HERO ---
];

const AppContent = () => {
  const location = useLocation();
  
  const isCleanPage = useMemo(() => 
    HIDE_LAYOUT_PATHS.includes(location.pathname), 
    [location.pathname]
  );

  return (
    <div className="app-container">
      {/* Header logic: Hero hide hoga lekin Header dikhega /about aur /contact par */}
      {!isCleanPage && (
        <>
          <Header />
          <Hero />
        </>
      )}

      {/* Manual Header for Clean Pages that still need navigation (About & Contact) */}
      {(location.pathname === '/about' || location.pathname === '/contact') && <Header />}

      <main className="main-content">
        <Suspense fallback={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-pink-600 font-bold uppercase tracking-widest text-xs">Loading RentMyVenue...</h2>
          </div>
        }>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/agent-login" element={<AgentLogin />} />
            <Route path="/agent-register" element={<AgentRegister />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard/>}/>
            <Route path="/agent-dashboard" element={<AgentDashboard />} /> 
            <Route path="/user-dashboard" element={<UserBooking />} /> 
            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping" element={<Shipping />} />

            <Route path="/" element={<UserRegister />} />
            <Route path="/about" element={<About />} />
            {/* --- CONTACT US ROUTE --- */}
            <Route path="/contact" element={<ContactUs />} />
            
            <Route path="/venue/:id" element={<VenueDetial />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer visibility logic */}
      {( !isCleanPage || location.pathname === '/about' || location.pathname === '/contact' ) && <Footer />}
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