import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { 
  User, LogOut, ChevronDown, LayoutDashboard, 
  Bookmark, Menu, X, Star, Heart, CheckCircle,
  Target, Eye, ShieldCheck, Zap, Users
} from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// Images
import Img1 from '../../public/image copy 4.png';
import Img2 from '../../public/image copy.png';
import Img3 from '../../public/huynhthientu-wedding-2815343_1920.jpg';

export default function AboutUs() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // --- PERSISTENCE & SYNC LOGIC ---
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const token = sessionStorage.getItem('token');
  const displayName = user.fullname || user.name || "Guest User";

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const slides = [
    { id: 1, title: "ABOUT US", img: Img1 },
    { id: 2, title: "ABOUT US", img: Img2 },
    { id: 3, title: "ABOUT US", img: Img3 },
  ];

  return (
    <div className="bg-pink-400 font-sans overflow-x-hidden flex flex-col min-h-screen">
      
      {/* --- SHARED NAV HEADER --- */}
      <div className="bg-pink-400  flex-none relative z-50">
   

<nav className="flex justify-between items-center bg-white px-5 py-4  border border-pink-100 shadow-xl relative">
    <div className="flex items-center gap-4">
        {/* Hamburger Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-pink-50 rounded-xl text-pink-600 md:hidden hover:bg-pink-100 transition-all">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 ml-2">
            {navLinks.map((link) => (
                <button key={link.name} onClick={() => navigate(link.path)} className="text-[10px] font-black uppercase tracking-widest text-pink-600 hover:text-pink-800 transition-colors">
                    {link.name}
                </button>
            ))}
        </div>
    </div>

    {/* Mobile Menu Links - Yeh part missing tha */}
    {isMenuOpen && (
      <div className="absolute top-[110%] left-0 w-full bg-white rounded-3xl shadow-2xl border border-pink-100 py-4 flex flex-col md:hidden z-50">
        {navLinks.map((link) => (
          <button 
            key={link.name} 
            onClick={() => { navigate(link.path); setIsMenuOpen(false); }} 
            className="w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-pink-600 hover:bg-pink-50"
          >
            {link.name}
          </button>
        ))}
      </div>
    )}

    {/* User Dropdown Section (Wahi hai jo pehle tha) */}
    <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="bg-pink-50 px-4 py-2 rounded-full border border-pink-100 flex items-center gap-2 hover:bg-pink-100 transition-all cursor-pointer">
              <User size={12} className="text-pink-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 truncate max-w-[80px]">{displayName}</span>
              <ChevronDown size={10} className={`text-pink-600 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isUserDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-pink-100 py-2 z-[60]">
              <button onClick={handleMyBookingsClick} className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-zinc-600 hover:bg-rose-50"><LayoutDashboard size={14} /> My Bookings</button>
              <button onClick={handleOwnerPortalClick} className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-zinc-600 hover:bg-rose-50"><Bookmark size={14} /> Owner Portal</button>
            </div>
          )}
        </div>
        {token && (
            <button onClick={() => { sessionStorage.clear(); navigate('/login'); }} className="bg-pink-600 text-white p-2.5 rounded-full shadow-lg hover:bg-rose-800 transition-all">
                <LogOut size={14} />
            </button>
        )}
    </div>
</nav>


      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full bg-pink-400 flex-none mt-4">
        <div className="max-w-[95%] mx-auto h-[45vh] md:px-2"> 
          <div className="relative h-full overflow-hidden rounded-[2.5rem] shadow-2xl"> 
            <Swiper modules={[Autoplay, EffectFade]} effect="fade" loop={true} autoplay={{ delay: 5000 }} speed={2000} className="h-full w-full">
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  {({ isActive }) => (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0" style={{ backgroundImage: `url(${slide.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div className="absolute inset-0 bg-black/40" />
                      <h2 className={`relative z-10 text-white text-4xl md:text-6xl font-black transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {slide.title}
                      </h2>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* --- CONTENT AREA --- */}
      <div className="bg-white mt-[-2rem] rounded-t-[3rem] relative z-10 flex-grow pb-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <section className="max-w-7xl mx-auto px-6 pt-16">
          
          {/* 1. About RentMyVenue Description */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h1 className="text-3xl md:text-5xl font-black text-rose-950 uppercase tracking-tighter mb-6 italic">About <span className="text-pink-600">RentMyVenue</span></h1>
            <p className="text-sm md:text-base text-zinc-600 font-bold uppercase tracking-tight leading-relaxed">
              RentMyVenue is an online venue discovery and booking platform that helps people find the perfect event space quickly and easily. Whether you are planning a wedding, birthday party, or corporate meeting, we connect you with affordable venues in one place.
            </p>
          </div>

          {/* 2. Why Choose RentMyVenue & Goals */}
          <div className="grid md:grid-cols-2 gap-12 mb-20 items-start">
            <div className="bg-rose-50 p-10 rounded-[3rem] border border-pink-100">
              <h3 className="text-2xl font-black text-rose-950 uppercase mb-6 flex items-center gap-3 italic">
                <ShieldCheck className="text-pink-600" /> Why Choose Us?
              </h3>
              <ul className="space-y-4">
                {[
                  "Wide range of event venues and party spaces",
                  "Affordable venue options for every budget",
                  "Easy venue search and booking",
                  "Direct connection with venue owners",
                  "Perfect for weddings, birthdays, and parties"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[11px] font-black text-zinc-600 uppercase tracking-widest">
                    <div className="h-1.5 w-1.5 bg-pink-600 rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950 p-10 rounded-[3rem] text-white shadow-2xl">
              <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 italic">
                <Target className="text-pink-400" /> Our Goals
              </h3>
              <ul className="space-y-4">
                {[
                  "Search and explore verified venues",
                  "Compare venue prices and amenities",
                  "Find affordable event spaces effortlessly",
                  "Connect directly with venue owners",
                  "Make venue booking fast and transparent"
                ].map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                    <CheckCircle size={16} className="text-pink-400 shrink-0" /> {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Mission & Vision Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
             <div className="flex flex-col md:flex-row gap-6 items-center bg-white p-8 rounded-[2.5rem] border-2 border-pink-50 hover:border-pink-200 transition-all">
                <div className="bg-pink-100 p-5 rounded-3xl"><Zap className="text-pink-600" size={32} /></div>
                <div>
                  <h4 className="font-black text-rose-950 uppercase text-xl italic mb-2">Our Mission</h4>
                  <p className="text-zinc-500 text-[10px] font-black uppercase leading-relaxed tracking-wider">To simplify event planning by providing a reliable platform where users can discover banquet halls and unique spaces quickly.</p>
                </div>
             </div>
             <div className="flex flex-col md:flex-row gap-6 items-center bg-white p-8 rounded-[2.5rem] border-2 border-pink-50 hover:border-pink-200 transition-all">
                <div className="bg-rose-100 p-5 rounded-3xl"><Eye className="text-rose-600" size={32} /></div>
                <div>
                  <h4 className="font-black text-rose-950 uppercase text-xl italic mb-2">Our Vision</h4>
                  <p className="text-zinc-500 text-[10px] font-black uppercase leading-relaxed tracking-wider">To become India's most trusted online platform for venue discovery, making it easy to find the perfect space for every occasion.</p>
                </div>
             </div>
          </div>

          {/* 4. Helping Venue Owners */}
          <div className="bg-pink-50 p-12 rounded-[4rem] text-center border border-pink-100">
            <Users size={40} className="mx-auto text-pink-600 mb-6" />
            <h2 className="text-3xl font-black text-rose-950 uppercase italic mb-4">Helping Venue Owners Grow</h2>
            <p className="max-w-2xl mx-auto text-[11px] font-bold text-zinc-600 uppercase tracking-widest leading-loose mb-8">
              We help venue owners promote their spaces online and reach potential customers. Increase visibility, receive inquiries, and manage listings easily to grow your business.
            </p>
            <button onClick={() => navigate('/owner-dashboard')} className="bg-pink-600 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-rose-800 transition-all shadow-xl">
              List Your Venue Now
            </button>
          </div>

        </section>
      </div>
    </div>
  );
}