import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VenueManager = () => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
    
    const [venueData, setVenueData] = useState({
        name: '', price: '', city: '', tehsil: '', state: '', address: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // 1. Save Venue to Atlas
    const handleSaveVenue = async (e) => {
        e.preventDefault();
        try {
            // FIX: Data structure ko Backend Model ke hisaab se adjust kiya gaya hai
            const response = await axios.post(`${API_BASE}/api/venue/register`, {
                ownerId: "65b2f1234567890123456789", // Valid 24-char dummy ID
                name: venueData.name,
                price: Number(venueData.price), 
                location: {
                    address: venueData.address, // Model expects 'address' inside 'location'
                    city: venueData.city,
                    tehsil: venueData.tehsil,
                    state: venueData.state
                }
            });

            if(response.status === 200 || response.status === 201) {
                alert("✨ Venue Saved Successfully!");
                setVenueData({ name: '', price: '', city: '', tehsil: '', state: '', address: '' });
            }
        } catch (err) {
            console.error("Save Error Details:", err.response?.data);
            alert(`❌ Error: ${err.response?.data?.message || "Check Backend Console"}`);
        }
    };

    // 2. Filter Search Logic
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.length >= 1) {
                try {
                    const res = await axios.get(`${API_BASE}/api/search?query=${searchTerm}`);
                    setSearchResults(res.data);
                } catch (err) {
                    console.error("Search API Error:", err);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, API_BASE]);

    return (
        <div className="min-h-screen bg-[#031930] p-5 md:p-10 text-white font-sans">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
                
                {/* --- LEFT: ADD VENUE FORM --- */}
                <div className="bg-[#0a2540] p-6 rounded-2xl border border-blue-900 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 text-blue-400">Add Real Hotel Data</h2>
                    <form onSubmit={handleSaveVenue} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Hotel Name" 
                            className="w-full p-3 bg-[#031930] border border-blue-800 rounded outline-none focus:border-blue-500 text-white" 
                            value={venueData.name} 
                            onChange={(e) => setVenueData({...venueData, name: e.target.value})} 
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Price per Day" 
                            className="w-full p-3 bg-[#031930] border border-blue-800 rounded outline-none focus:border-blue-500 text-white" 
                            value={venueData.price} 
                            onChange={(e) => setVenueData({...venueData, price: e.target.value})} 
                            required 
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="City" 
                                className="p-3 bg-[#031930] border border-blue-800 rounded outline-none focus:border-blue-500 text-white" 
                                value={venueData.city} 
                                onChange={(e) => setVenueData({...venueData, city: e.target.value})} 
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="Tehsil" 
                                className="p-3 bg-[#031930] border border-blue-800 rounded outline-none focus:border-blue-500 text-white" 
                                value={venueData.tehsil} 
                                onChange={(e) => setVenueData({...venueData, tehsil: e.target.value})} 
                            />
                        </div>
                        <input 
                            type="text" 
                            placeholder="State" 
                            className="w-full p-3 bg-[#031930] border border-blue-800 rounded outline-none focus:border-blue-500 text-white" 
                            value={venueData.state} 
                            onChange={(e) => setVenueData({...venueData, state: e.target.value})} 
                            required 
                        />
                        <textarea 
                            placeholder="Full Address" 
                            className="w-full p-3 bg-[#031930] border border-blue-800 rounded outline-none focus:border-blue-500 text-white" 
                            value={venueData.address} 
                            onChange={(e) => setVenueData({...venueData, address: e.target.value})}
                            required
                        ></textarea>
                        <button type="submit" className="w-full bg-blue-600 py-3 rounded-lg font-bold hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                            Add to Atlas
                        </button>
                    </form>
                </div>

                {/* --- RIGHT: LIVE FILTER SEARCH --- */}
                <div className="bg-[#0a2540] p-6 rounded-2xl border border-blue-900 shadow-xl flex flex-col">
                    <h2 className="text-xl font-bold mb-6 text-cyan-400">Live Search (Filter)</h2>
                    
                    <div className="relative mb-6">
                        <input 
                            type="text" 
                            placeholder="Type City or Hotel Name..." 
                            className="w-full p-4 bg-[#031930] border-2 border-cyan-900 rounded-full outline-none focus:border-cyan-500 text-white pl-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-4 top-4 opacity-50 text-xl">🔍</span>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {searchResults.length > 0 ? (
                            searchResults.map((venue) => (
                                <div key={venue._id} className="bg-[#102a43] p-4 rounded-xl border-l-4 border-cyan-500 hover:bg-blue-900 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{venue.name}</h3>
                                            <p className="text-cyan-400 text-xs uppercase tracking-widest">
                                                {venue.location?.city}, {venue.location?.tehsil || venue.location?.state}
                                            </p>
                                        </div>
                                        <span className="bg-green-600 text-xs px-2 py-1 rounded-md font-bold text-white">
                                            ₹{venue.price}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-2 italic line-clamp-2">{venue.location?.address}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 italic">
                                {searchTerm ? "No hotels found..." : "Start typing to search..."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueManager;