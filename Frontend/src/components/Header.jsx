import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, X, MapPin, Building2, Map } from 'lucide-react';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // 3 Alag States Inputs ke liye
  const [searchData, setSearchData] = useState({
    city: '',
    tehsil: '',
    state: ''
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Input change handler
  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  // LIVE SEARCH LOGIC: Teeno mein se kuch bhi badle toh API call jaye
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
    }, 400); // 400ms delay for smoother typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchData]);

  return (
    <header className="w-full text-white font-sans uppercase text-[11px] font-bold sticky top-0 z-50">
      <div className="bg-[#031930] px-6 md:px-10 py-5 flex justify-between items-center relative border-b border-white/10">
        
        <div className="flex items-center gap-4 flex-1">
          {isSearchOpen ? (
            <div className="relative w-full max-w-4xl animate-in fade-in slide-in-from-left-4">
              <div className="flex flex-col md:flex-row items-center bg-white/5 border border-white/20 rounded-2xl md:rounded-full px-4 py-2 gap-2 backdrop-blur-xl">
                
                {/* CITY INPUT */}
                <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0">
                  <MapPin size={14} className="text-cyan-400 shrink-0" />
                  <input
                    name="city"
                    type="text"
                    placeholder="City (Kanpur)"
                    className="bg-transparent outline-none text-white text-[12px] w-full normal-case"
                    value={searchData.city}
                    onChange={handleChange}
                  />
                </div>

                {/* TEHSIL INPUT */}
                <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0 px-0 md:px-2">
                  <Building2 size={14} className="text-cyan-400 shrink-0" />
                  <input
                    name="tehsil"
                    type="text"
                    placeholder="Tehsil"
                    className="bg-transparent outline-none text-white text-[12px] w-full normal-case"
                    value={searchData.tehsil}
                    onChange={handleChange}
                  />
                </div>

                {/* STATE INPUT */}
                <div className="flex items-center gap-2 flex-1 w-full px-0 md:px-2">
                  <Map size={14} className="text-cyan-400 shrink-0" />
                  <input
                    name="state"
                    type="text"
                    placeholder="State"
                    className="bg-transparent outline-none text-white text-[12px] w-full normal-case"
                    value={searchData.state}
                    onChange={handleChange}
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3 pl-2">
                   {loading && <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>}
                   <X 
                    size={18} 
                    className="cursor-pointer text-red-400 hover:rotate-90 transition-all" 
                    onClick={() => { setIsSearchOpen(false); setSearchData({city:'', tehsil:'', state:''}); }} 
                  />
                </div>
              </div>

              {/* LIVE DROPDOWN RESULTS */}
              {results.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#052b52] border border-white/10 mt-2 rounded-xl shadow-2xl overflow-hidden z-[100]">
                  {results.map((venue) => (
                    <div 
                      key={venue._id} 
                      className="p-4 border-b border-white/5 hover:bg-cyan-500/20 cursor-pointer transition-all flex justify-between items-center group"
                      onClick={() => { setSelectedVenue(venue); setIsSearchOpen(false); }}
                    >
                      <div>
                        <div className="text-white text-[13px] normal-case font-semibold group-hover:text-cyan-400 transition-colors">{venue.name}</div>
                        <div className="text-gray-400 text-[10px] lowercase mt-1 italic">
                          {venue.location.tehsil}, {venue.location.city}, {venue.location.state}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 text-[12px]">₹{venue.price}</div>
                        <div className="text-[9px] text-gray-500 normal-case">Per Day</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
            >
              <Search size={16} className="text-cyan-400" />
              <span className="text-white/60 text-[10px] tracking-widest uppercase">Start Your Venue Search...</span>
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
           <ShoppingCart size={18} className="cursor-pointer hover:text-cyan-400" />
           <button className="bg-cyan-500 text-[#031930] px-6 py-2 rounded-full font-bold text-[10px] hover:bg-cyan-400 transition-all">
             Login / Sign Up
           </button>
        </div>
      </div>
      
      {/* SUCCESS MESSAGE */}
      {selectedVenue && (
        <div className="bg-green-500/20 border-b border-green-500/50 text-green-400 py-2 px-10 text-center text-[10px] flex justify-center items-center gap-3">
          📍 Viewing: <span className="font-bold underline">{selectedVenue.name}</span> in {selectedVenue.location.city}
          <button onClick={() => setSelectedVenue(null)} className="bg-green-500 text-white px-2 py-0.5 rounded text-[8px]">CLOSE</button>
        </div>
      )}
    </header>
  );
}