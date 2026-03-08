import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    // LocalStorage se user nikalna
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-zinc-950 border-b border-zinc-800 p-4 sticky top-0 z-[100]">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link title="Home" to="/" className="text-xl font-black text-cyan-500 italic">RENT MY VENUE</Link>
                
                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-zinc-400">Hello, <span className="text-white font-bold">{user.name}</span></span>
                            <button onClick={handleLogout} className="text-xs text-red-500 border border-red-500/30 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition">Logout</button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="bg-cyan-500 text-black px-5 py-2 rounded-xl font-bold text-sm">Login</button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;