import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../Pages/Auth/UserRegister.jsx';
import UserLogin from '../Pages/Auth/UserLogin.jsx';
import OwnerRegister from '../Pages/Auth/OwnerRegister.jsx';
import OwnerLogin from '../Pages/Auth/OwnerLogin.jsx';

const AppRoutes = () => {
  return (
    <Router>    
        <Routes>
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/owner/register" element={<OwnerRegister />} />
            <Route path="/owner/login" element={<OwnerLogin />} />

        </Routes>
    </Router>
  );
}    
export default AppRoutes;