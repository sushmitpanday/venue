import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { User, LogOut, ChevronDown, LayoutDashboard, Bookmark, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// Images 
import Img1 from '../../public/image copy 2.png';
import Img2 from '../../public/image copy 3.png';
import Img3 from '../../public/image copy 5.png';

export default function Aboutus() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // New state for user dropdown

  // --- PERSISTENCE LOGIC (sessionStorage for tab-based login) ---
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const token = sessionStorage.getItem('token');
  
  // Display name logic
  const displayName = user.fullname || user.name || "Guest User";

  // --- NAVIGATION LOGIC WITH PROTECTION ---
  const handleMyBookingsClick = () => {
    if (!token) {
      alert("Please login to see your bookings!");
      navigate('/login');
    } else {
      navigate('/user-dashboard');
    }
    setIsDashboardOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleOwnerPortalClick = () => {
    if (!token) {
      alert("Please login first to access Owner Portal");
      navigate('/login');
    } else if (user.role === 'admin') {
      alert("Admin is not allowed to access Owner Portal");
    } else {
      navigate('/owner-dashboard');
    }
    setIsDashboardOpen(false);
    setIsUserDropdownOpen(false);
  };

  const slides = [
    { id: 1, title: "Modern Stay", span: "Comfort", sub: "FROM SEARCH TO CELEBRATION- AFFORDABLE VENUES MADE EASY", img: Img1 },
    { id: 2, title: "Modern Stay", span: "Comfort", sub: "BOOK BEAUTIFUL VENUES AT BUDGET FRIENDLY RATES", img: Img2 },
    { id: 3, title: "Modern Stay", span: "Comfort", sub: "GREAT VENUES, AFFORDABLE PRICES", img: Img3 },
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <div className="bg-pink-400 font-sans overflow-x-hidden flex flex-col min-h-screen">
      
      <div className="bg-pink-400  flex-none relative z-50">
        <nav className=" flex justify-between items-center bg-white px-5 py-4  border border-pink-100 shadow-lg">
            
            <div className="flex items-center md:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-2 bg-pink-50 rounded-xl text-pink-600"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
                {navLinks.map((link) => (
                    <button 
                      key={link.name}
                      onClick={() => navigate(link.path)}
                      className="text-[11px] font-black uppercase tracking-[0.2em] text-pink-600 hover:text-pink-800 transition-all"
                    >
                      {link.name}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                {/* Desktop Dashboard Dropdown */}
                {/* <div className="hidden md:block relative">
                  <button 
                    onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                    className="flex items-center gap-1 bg-pink-50 px-3 py-2 rounded-full border border-pink-100 text-[10px] font-black uppercase tracking-widest text-pink-600 hover:bg-pink-100 transition-all"
                  >
                    Dashboard <ChevronDown size={12} className={isDashboardOpen ? 'rotate-180' : ''} />
                  </button>
                  
                  {isDashboardOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-pink-100 py-2">
                      <button 
                        onClick={handleMyBookingsClick} 
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-zinc-600 hover:bg-rose-50"
                      >
                        <LayoutDashboard size={14} /> My Bookings
                      </button>
                      <button 
                        onClick={handleOwnerPortalClick} 
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-zinc-600 hover:bg-rose-50"
                      >
                        <Bookmark size={14} /> Owner Portal
                      </button>
                    </div>
                  )}
                </div> */}

                {/* --- DISPLAY NAME SECTION WITH DROPDOWN --- */}
                <div className="relative">
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="bg-pink-600 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-pink-700 transition-all cursor-pointer"
                  >
                      <User size={12} className="text-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white truncate max-w-[80px]">
                        {displayName}
                      </span>
                      <ChevronDown size={10} className={`text-white transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-pink-100 py-2 z-[60]">
                      <button 
                        onClick={handleMyBookingsClick} 
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-zinc-600 hover:bg-rose-50"
                      >
                        <LayoutDashboard size={14} /> My Bookings
                      </button>
                      <button 
                        onClick={handleOwnerPortalClick} 
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-zinc-600 hover:bg-rose-50"
                      >
                        <Bookmark size={14} /> USER DASHBOARD
                      </button>
                    </div>
                  )}
                </div>

                {token && (
                    <button 
                        onClick={() => { sessionStorage.clear(); navigate('/login'); }} 
                        className="bg-rose-900 text-white p-2.5 rounded-full hover:bg-red-500 transition-all shadow-lg"
                    >
                        <LogOut size={14} />
                    </button>
                )}
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-5 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-pink-100 overflow-hidden py-4 md:hidden">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <button 
                      key={link.name}
                      onClick={() => { navigate(link.path); setIsMenuOpen(false); }}
                      className="text-left px-6 py-3 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-600 hover:bg-rose-50"
                    >
                      {link.name}
                    </button>
                  ))}
                  <hr className="border-pink-50 my-2" />
                  {/* <button onClick={handleMyBookingsClick} className="text-left px-6 py-3 text-[11px] font-black uppercase text-zinc-600">
                    My Bookings
                  </button>
                  <button onClick={handleOwnerPortalClick} className="text-left px-6 py-3 text-[11px] font-black uppercase text-zinc-600">
                    Owner Portal
                  </button> */}
                </div>
              </div>
            )}
        </nav>
      </div>

      <section className="relative w-full bg-pink-400 flex-grow mt-4 mb-8">
        <div className="max-w-[95%] mx-auto h-[70vh] md:px-2"> 
          <div className="relative h-full overflow-hidden rounded-[2.5rem] shadow-2xl"> 
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="h-full w-full"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  {({ isActive }) => (
                    <div className="relative w-full h-full flex items-center justify-center p-6">
                      <div className="absolute inset-0" style={{ backgroundImage: `url(${slide.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div className="absolute inset-0 bg-black/50"></div>
                      <div className="container relative z-10 text-center text-white">
                        <h5 className="uppercase tracking-[3px] font-bold text-[9px] mb-4 transition-all">{slide.sub}</h5>
                        <h2 className="text-5xl font-black">{slide.title}</h2>
                        <h2 className="text-pink-300 text-5xl font-black italic">{slide.span}</h2>
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
}