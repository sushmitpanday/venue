import { useEffect } from 'react';
import axios from 'axios';

const AdminDirectLogin = () => {
    // 1. API_BASE logic yahan bhi use karein
    const API_BASE = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://venue-386d.vercel.app";

    useEffect(() => {
        const autoLogin = async () => {
            try {
                // 2. API_BASE ka use karke backend call karein
                const res = await axios.get(`${API_BASE}/api/admin/direct-access`);
                
                if (res.data.success) {
                    // 3. Sabhi details localStorage mein save karein
                    localStorage.setItem('userEmail', res.data.adminData.email);
                    localStorage.setItem('userRole', res.data.adminData.role);
                    
                    // Agar backend se token aa raha hai toh usey bhi save karein
                    if(res.data.token) {
                        localStorage.setItem('token', res.data.token);
                    }

                    // 4. Redirect to Dashboard
                    window.location.href = '/dashboard';
                }
            } catch (err) {
                console.error("Bypass failed:", err);
                alert("Admin access failed. Please check server connection.");
            }
        };
        autoLogin();
    }, [API_BASE]); // Dependency array mein API_BASE daalna achhi practice hai

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
            <h2>Admin Master Access</h2>
            <p>Identifying admin credentials... Please wait.</p>
        </div>
    );
};

export default AdminDirectLogin;