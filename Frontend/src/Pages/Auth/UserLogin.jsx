import React, { useState } from 'react';
import './auth.css';
import Illustration from './Illustration';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    await axios.post('http://localhost:5000/api/auth/user/login',{
      email:email,
       Password:Password
    }, {
    withCredentials:true
  }).then((res)=>{
    console.log(res.data);
   
  }).catch((err)=>{
    alert(err.response.data.message);
  })
  };

  return (
    <div className="auth-page">
      <div className="auth-container mt-[10%]">
        <Illustration />
        <div className="auth-card h-[400px]">
          <form onSubmit={handleSubmit}>
            <div className="auth-title">User Login</div>

            <div className="auth-field">
              <label className="small-muted">Email</label>
              <input className="auth-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="enter email" />
            </div>

            <div className="auth-field">
              <label className="small-muted">Password</label>
              <input className="auth-input" value={Password} onChange={e => setPassword(e.target.value)} type="password" placeholder="enter password" />
            </div>

            <div className="auth-actions">
              <button className="btn-primary" type="submit" >Login</button>
              <button className="btn-ghost" type="button">Forgot?</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
