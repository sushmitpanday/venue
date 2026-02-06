import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, X, MapPin, Building2, Map, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  
  const [searchData, setSearchData] = useState({
    city: '',
    tehsil: '',
    state: ''
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const { city, tehsil, state } = searchData;
      
      if (city || tehsil || state) {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:3000/api/search`, {
            params: { city, tehsil, state }
          });
          setResults(res.data);
        } catch (err) {
          console.error("Search Error:", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchData]);

  return (
    <header className="w-full text-white font-sans uppercase text-[11px] font-bold sticky top-0 z-50">
      <div className="bg-[#031930] px-4 md:px-10 py-4 flex justify-between items-center relative border-b border-white/10 shadow-xl">
        
        {/* LOGO SECTION */}
        <div className="flex items-center mr-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-cyan-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
               <Building2 size={20} className="text-[#031930]" />
            </div>
            <span className="text-lg font-black tracking-tighter normal-case">
              RENT<span className="text-cyan-400">MYVENUE</span>
            </span>
          </Link>
        </div>

        {/* SEARCH SECTION */}
        <div className="flex items-center gap-4 flex-1">
          {isSearchOpen ? (
            <div className="relative w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col md:flex-row items-center bg-white/5 border border-white/20 rounded-2xl md:rounded-full px-4 py-2 gap-2 backdrop-blur-xl">
                
                <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0">
                  <MapPin size={14} className="text-cyan-400 shrink-0" />
                  <input
                    name="city"
                    type="text"
                    placeholder="City"
                    className="bg-transparent outline-none text-white text-[12px] w-full normal-case placeholder:text-white/30"
                    value={searchData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0 px-0 md:px-2">
                  <Building2 size={14} className="text-cyan-400 shrink-0" />
                  <input
                    name="tehsil"
                    type="text"
                    placeholder="Tehsil"
                    className="bg-transparent outline-none text-white text-[12px] w-full normal-case placeholder:text-white/30"
                    value={searchData.tehsil}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center gap-2 flex-1 w-full px-0 md:px-2">
                  <Map size={14} className="text-cyan-400 shrink-0" />
                  <input
                    name="state"
                    type="text"
                    placeholder="State"
                    className="bg-transparent outline-none text-white text-[12px] w-full normal-case placeholder:text-white/30"
                    value={searchData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center gap-3 pl-2">
                   {loading && <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>}
                   <X 
                    size={18} 
                    className="cursor-pointer text-white/50 hover:text-red-400 transition-colors" 
                    onClick={() => { setIsSearchOpen(false); setSearchData({city:'', tehsil:'', state:''}); }} 
                  />
                </div>
              </div>

              {/* LIVE DROPDOWN RESULTS */}
              {results.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#052b52] border border-white/10 mt-2 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-md">
                  {results.map((venue) => (
                    <div 
                      key={venue._id} 
                      className="p-4 border-b border-white/5 hover:bg-cyan-500/10 cursor-pointer transition-all flex justify-between items-center group"
                      onClick={() => { setSelectedVenue(venue); setIsSearchOpen(false); }}
                    >
                      <div>
                        <div className="text-white text-[13px] normal-case font-semibold group-hover:text-cyan-400 transition-colors">{venue.name}</div>
                        <div className="text-gray-400 text-[10px] lowercase mt-1 opacity-70">
                          {venue.location.tehsil}, {venue.location.city}, {venue.location.state}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 text-[12px] font-black tracking-normal">₹{venue.price}</div>
                        <div className="text-[8px] text-gray-500 normal-case tracking-widest">PER DAY</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group max-w-md w-full"
            >
              <Search size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-white/40 text-[9px] tracking-[2px] uppercase">Find the perfect venue...</span>
            </button>
          )}
        </div>

        {/* AUTH BUTTONS SECTION */}
        <div className="flex items-center gap-3 ml-4">
           <div className="hidden lg:flex items-center mr-4 bg-white/5 p-2 rounded-full border border-white/5">
             <ShoppingCart size={16} className="cursor-pointer text-white/70 hover:text-cyan-400 transition-colors" />
           </div>
           
           {/* LOGIN BUTTON */}
           <Link 
            to="/login" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-all active:scale-95"
           >
             <LogIn size={14} className="text-cyan-400" />
             <span className="hidden sm:inline">LOGIN</span>
           </Link>

           {/* REGISTER BUTTON */}
           <Link 
            to="/register" 
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-[#031930] rounded-full hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
           >
             <UserPlus size={14} />
             <span className="hidden sm:inline">SIGN UP</span>
           </Link>
        </div>
      </div>
      
      {/* SUCCESS STRIP */}
      {selectedVenue && (
        <div className="bg-cyan-500/10 border-b border-cyan-500/20 text-cyan-400 py-1.5 px-10 text-center text-[9px] flex justify-center items-center gap-3 tracking-widest animate-in slide-in-from-top duration-300">
          <span className="flex items-center gap-1"><MapPin size={10} /> {selectedVenue.name} SELECTED</span>
          <button onClick={() => setSelectedVenue(null)} className="hover:text-white transition-colors underline decoration-dotted">DISMISS</button>
        </div>
      )}
    </header>
  );
}