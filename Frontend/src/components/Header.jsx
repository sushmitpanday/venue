import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, MapPin, Building2, Map, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://venue-xqee.vercel.app";
  
  const [searchData, setSearchData] = useState({ city: '', tehsil: '', state: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  // --- SEARCH LOGIC ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const { city, tehsil, state } = searchData;
      if (city.trim() || tehsil.trim() || state.trim()) {
        setLoading(true);
        try {
          const combinedQuery = `${city} ${tehsil} ${state}`.trim();
          const res = await axios.get(`${API_BASE}/api/search`, {
            params: { query: combinedQuery }
          });
          setResults(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error("Header Search Error:", err.message);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchData, API_BASE]);

  // Click handler to show details
  const handleVenueClick = (id) => {
    setIsSearchOpen(false);
    setResults([]);
    navigate(`/venue/${id}`); // Maan ke chal raha hoon aapka route /venue/:id hai
  };

  return (
    <header className="w-full text-white font-sans uppercase text-[11px] font-bold sticky top-0 z-[100]">
      <div className="bg-[#031930] px-4 md:px-10 py-3 md:py-4 flex justify-between items-center relative border-b border-white/10 shadow-xl">
        
        {/* LOGO - Hidden on small mobile when search is open */}
        <div className={`flex items-center ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-cyan-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
               <Building2 size={18} className="text-[#031930]" />
            </div>
            <span className="text-base md:text-lg font-black tracking-tighter normal-case">
              RENT<span className="text-cyan-400">MYVENUE</span>
            </span>
          </Link>
        </div>

        {/* SEARCH SECTION - Expands on Mobile */}
        <div className={`flex items-center gap-4 transition-all duration-300 ${isSearchOpen ? 'flex-1 mx-2' : 'flex-initial'}`}>
          {isSearchOpen ? (
            <div className="relative w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col md:flex-row items-center bg-white/5 border border-white/20 rounded-2xl md:rounded-full px-3 py-2 md:py-1.5 gap-2 backdrop-blur-xl">
                
                <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 pb-1 md:pb-0">
                  <MapPin size={12} className="text-cyan-400 shrink-0" />
                  <input
                    name="city"
                    placeholder="City"
                    className="bg-transparent outline-none text-white text-[11px] w-full normal-case placeholder:text-white/30"
                    value={searchData.city}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>

                <div className="hidden md:flex items-center gap-2 flex-1 w-full border-r border-white/10 px-2">
                  <Building2 size={12} className="text-cyan-400 shrink-0" />
                  <input
                    name="tehsil"
                    placeholder="Tehsil"
                    className="bg-transparent outline-none text-white text-[11px] w-full normal-case placeholder:text-white/30"
                    value={searchData.tehsil}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center gap-2 flex-1 w-full md:px-2">
                  <Map size={12} className="text-cyan-400 shrink-0" />
                  <input
                    name="state"
                    placeholder="State"
                    className="bg-transparent outline-none text-white text-[11px] w-full normal-case placeholder:text-white/30"
                    value={searchData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    {loading && <div className="animate-spin h-3 w-3 border-2 border-cyan-400 border-t-transparent rounded-full"></div>}
                    <X 
                    size={18} 
                    className="cursor-pointer text-white/50 hover:text-red-400 transition-colors" 
                    onClick={() => { setIsSearchOpen(false); setResults([]); }} 
                  />
                </div>
              </div>

              {/* RESULTS DROPDOWN - Mobile Optimized */}
              {results.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#052b52] border border-white/10 mt-2 rounded-2xl shadow-2xl overflow-y-auto max-h-[60vh] z-[110]">
                  {results.map((venue) => (
                    <div 
                      key={venue._id} 
                      className="p-4 border-b border-white/5 hover:bg-cyan-500/10 cursor-pointer flex justify-between items-center group transition-colors"
                      onClick={() => handleVenueClick(venue._id)}
                    >
                      <div className="flex-1 mr-4">
                        <div className="text-white text-[12px] md:text-[13px] normal-case font-semibold group-hover:text-cyan-400 truncate">{venue.name}</div>
                        <div className="text-gray-400 text-[10px] lowercase opacity-70 flex items-center gap-1">
                          <MapPin size={8} /> {venue.location?.city}, {venue.location?.state}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-cyan-400 text-[12px] font-black">₹{venue.price}</div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest">PER DAY</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group w-10 md:w-64"
            >
              <Search size={16} className="text-cyan-400 shrink-0" />
              <span className="hidden md:inline text-white/40 text-[9px] tracking-[2px] uppercase">Search...</span>
            </button>
          )}
        </div>

        {/* AUTH BUTTONS - Icons only on Mobile */}
  {/* --- AUTH BUTTONS SECTION --- */}
<div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
    {/* Login Button */}
    <Link to="/login" className="flex items-center gap-2 px-3 md:px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all">
        <LogIn size={14} className="text-cyan-400" />
        {/* 'hidden sm:inline' ko hata kar sirf 'inline' ya text size chota kar diya hai */}
        <span className="text-[10px] md:text-[11px]">LOGIN</span>
    </Link>

    {/* Sign Up Button */}
    <Link to="/register" className="flex items-center gap-2 px-3 md:px-5 py-2 bg-cyan-500 text-[#031930] rounded-full hover:bg-cyan-400 transition-all shadow-lg">
        <UserPlus size={14} />
        {/* Same yahan bhi text hamesha dikhega */}
        <span className="text-[10px] md:text-[11px]">SIGN UP</span>
    </Link>
</div>
      </div>
    </header>
  );
}