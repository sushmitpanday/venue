import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { 
  User, LogOut, Mail, Phone, Send, 
  Menu, X, ChevronDown, LayoutDashboard, Bookmark, Settings 
} from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// Images 
import Img1 from '../../public/image copy 4.png';
import Img2 from '../../public/image copy.png';
import Img3 from '../../public/huynhthientu-wedding-2815343_1920.jpg';

export default function ContactUs() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // New state for user dropdown
  
  // --- PERSISTENCE LOGIC (Sync with AboutUs) ---
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const token = sessionStorage.getItem('token');
  const displayName = user.fullname || user.name || "Guest User";

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

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
    { id: 1, title: "CONTACT US", span: "", sub: "", img: Img1 },
    { id: 2, title: "CONTACT US", span: "", sub: "", img: Img2 },
    { id: 3, title: "CONTACT US", span: "", sub: "", img: Img3 },
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const handleLogout = () => {
    sessionStorage.clear(); // Updated to sessionStorage for consistency
    navigate('/login'); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Thank you! Your message has been sent.");
  };

  return (
    <div className="bg-pink-400 font-sans overflow-x-hidden flex flex-col min-h-screen">
      
      {/* --- SHARED NAV HEADER (Updated to match AboutUs) --- */}
      <div className="bg-pink-400  flex-none relative z-50">
        <nav className=" flex justify-between items-center bg-white px-5 py-4  border border-pink-100 shadow-xl relative">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-pink-50 rounded-xl text-pink-600 md:hidden hover:bg-pink-100 transition-all">
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div className="hidden md:flex items-center gap-6 ml-2">
                    {navLinks.map((link) => (
                        <button key={link.name} onClick={() => navigate(link.path)} className="text-[10px] font-black uppercase tracking-widest text-pink-600 hover:text-pink-800 transition-colors">
                            {link.name}
                        </button>
                    ))}
                    
                    {/* Dashboard Dropdown (Desktop Only) */}
                    <div className="relative">
                        {/* <button onClick={() => setIsDashboardOpen(!isDashboardOpen)} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-pink-600 hover:text-pink-800 transition-colors">
                            Dashboard <ChevronDown size={14} className={`transition-transform ${isDashboardOpen ? 'rotate-180' : ''}`} />
                        </button> */}
                        {/* {isDashboardOpen && (
                            <div className="absolute top-full left-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl py-2 overflow-hidden border border-pink-100 animate-in fade-in slide-in-from-top-2">
                                <button onClick={handleMyBookingsClick} className="w-full text-left px-4 py-3 text-[10px] font-bold text-zinc-600 hover:bg-rose-50 flex items-center gap-3"><LayoutDashboard size={14} /> My Bookings</button>
                                <button onClick={handleOwnerPortalClick} className="w-full text-left px-4 py-3 text-[10px] font-bold text-zinc-600 hover:bg-rose-50 flex items-center gap-3"><Bookmark size={14} /> Owner Portal</button>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* --- DISPLAY NAME SECTION WITH DROPDOWN (Updated) --- */}
                <div className="relative">
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="bg-pink-50 px-4 py-2 rounded-full border border-pink-100 flex items-center gap-2 hover:bg-pink-100 transition-all cursor-pointer"
                  >
                      <User size={12} className="text-pink-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 truncate max-w-[80px]">
                        {displayName}
                      </span>
                      <ChevronDown size={10} className={`text-pink-600 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-pink-100 py-2 z-[60]">
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
                </div>

                {token && (
                    <button onClick={handleLogout} className="bg-pink-600 text-white p-2.5 rounded-full shadow-lg hover:bg-rose-800 transition-all group relative">
                        <LogOut size={14} />
                    </button>
                )}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-[2rem] shadow-2xl py-4 md:hidden border border-pink-100 z-50 animate-in slide-in-from-top-5">
                {navLinks.map((link) => (
                  <button key={link.name} onClick={() => { navigate(link.path); setIsMenuOpen(false); }} className="w-full text-left px-8 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-600 hover:bg-rose-50">{link.name}</button>
                ))}
                {/* <div className="border-t border-pink-50 mt-2 pt-2">
                    <p className="px-8 py-2 text-[9px] font-black text-pink-400 uppercase tracking-widest">Dashboards</p>
                    <button onClick={handleMyBookingsClick} className="w-full text-left px-8 py-3 text-[10px] font-bold text-zinc-500 hover:bg-rose-50 flex items-center gap-3"><LayoutDashboard size={14} /> My Bookings</button>
                    <button onClick={handleOwnerPortalClick} className="w-full text-left px-8 py-3 text-[10px] font-bold text-zinc-500 hover:bg-rose-50 flex items-center gap-3"><Bookmark size={14} /> Owner Portal</button>
                </div> */}
              </div>
            )}
        </nav>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full bg-pink-400 flex-none mt-4">
        <div className="max-w-[95%] mx-auto h-[50vh] md:px-2"> 
          <div className="relative h-full overflow-hidden rounded-[2.5rem] shadow-2xl"> 
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              speed={2000}
              className="h-full w-full"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  {({ isActive }) => (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0" style={{ backgroundImage: `url(${slide.img})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'kenburns 15s infinite alternate' }} />
                      <div className="absolute inset-0 bg-black/50"></div>
                      <div className="container relative z-10 text-center px-6">
                        <h2 className={`text-white text-4xl md:text-6xl font-black leading-none tracking-tighter transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                          {slide.title}
                        </h2>
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* --- CONTACT CONTENT SECTION (Design Intact) --- */}
      <div className="bg-white mt-[-2rem] rounded-t-[3rem] relative z-10 flex-grow pb-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <section className="max-w-7xl mx-auto px-6 pt-20">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-rose-950 leading-[0.9] tracking-tighter uppercase italic">
                <span className="text-pink-600">Contact us</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-rose-50 border border-pink-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-pink-400 transition-all" />
                   <input type="email" placeholder="EMAIL" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-rose-50 border border-pink-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-pink-400 transition-all" />
                </div>
                <input type="text" placeholder="SUBJECT" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-rose-50 border border-pink-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-pink-400 transition-all" />
                <textarea rows="4" placeholder="HOW CAN WE HELP?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-rose-50 border border-pink-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-pink-400 transition-all resize-none"></textarea>
                <button type="submit" className="w-full bg-pink-600 hover:bg-rose-950 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl flex items-center justify-center gap-3">
                  Send Message <Send size={16} />
                </button>
              </form>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white h-[350px] relative">
              <iframe title="Venue Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.0016462744747!2d81.01183107415494!3d26.776228365955682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be3a6697be98f%3A0x6e9a038536f967be!2sC-9%2F22%20PINEWOOD%20VILLA%2C%20SUSHANT%20GOLF%20CITY%20ANSAL%20API%2C%20Lucknow%2C%20UP%20226030!5e0!3m2!1sen!2sin!4v1709841372541!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="grayscale hover:grayscale-0 transition-all duration-700"></iframe>
            </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{__html: ` @keyframes kenburns { 0% { transform: scale(1); } 100% { transform: scale(1.1); } } `}} />
    </div>
  );
}