import React from "react";
import { Users, MapPin, Phone, Mail, FileText, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // Background changed to pink-400, text remains white for contrast
    <footer className="bg-pink-400 text-white font-sans pt-16 pb-6 text-[12px]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/20 pb-12 items-start">
        
        {/* LEFT: Legal & Shipping */}
        <div className="space-y-6 md:col-span-1">
          <h3 className="text-lg font-bold text-white border-b border-white/20 pb-2">Information</h3>
          
          <div className="flex flex-col space-y-4">
            {/* Terms Button - Glass Effect */}
            <Link 
              to="/terms" 
              className="flex items-center justify-between w-full p-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-white" />
                <span className="font-bold uppercase tracking-wider text-[11px]">Terms & Conditions</span>
              </div>
            </Link>

            {/* Privacy Button */}
            <Link 
              to="/privacy" 
              className="flex items-center justify-between w-full p-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-white" />
                <span className="font-bold uppercase tracking-wider text-[11px]">Privacy Policy</span>
              </div>
            </Link>

            {/* Shipping Button */}
            <Link 
              to="/shipping" 
              className="flex items-center justify-between w-full p-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-white" />
                <span className="font-bold uppercase tracking-wider text-[11px]">Shipping & Delivery</span>
              </div>
            </Link>
          </div>
        </div>

        {/* BEECH MEIN: Agent Portal - Using Rose shades for accent */}
        <div className="md:col-span-2 flex flex-col items-center text-center px-4 pt-2">
          <h3 className="text-lg font-black normal-case mb-6 tracking-tighter italic text-rose-800">
            Agent Portal
          </h3>
          <p className="text-white/80 normal-case mb-6 text-[11px] leading-tight max-w-xs">
            Earn commission by listing venues with us.
          </p>
          <div className="space-y-4 w-full max-w-xs">
            <Link
              to="/agent-register"
              className="inline-flex items-center gap-2 bg-rose-800 border border-rose-900/20 text-white px-5 py-3 rounded-xl hover:bg-rose-900 transition-all w-full justify-center font-black tracking-widest shadow-lg"
            >
              <Users size={16} />
              JOIN AS AGENT
            </Link>
            <Link
              to="/agent-login"
              className="block text-center text-white/70 hover:text-white transition-colors font-bold tracking-[2px] text-[10px]"
            >
              ALREADY AN AGENT? LOGIN
            </Link>
          </div>
        </div>

        {/* RIGHT MEIN: Address/Contact */}
        <div className="md:col-span-1 order-last md:order-none space-y-6 pt-2">
          <h3 className="text-lg font-bold text-white border-b border-white/20 pb-2">Contact Us</h3>
          
          <div className="space-y-5 text-white/90">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-rose-800 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">Building No./Flat No.: C-9/22 PINEWOOD VILLA, 
                SUSHANT GOLF CITY ANSAL API, Lucknow, UP - 226030</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-rose-800 shrink-0" />
              <p className="font-bold">(303) 555-0105</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={20} className="text-rose-800 shrink-0" />
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@rentmyvenue.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className='block text-white hover:text-rose-800 cursor-pointer font-black transition-colors underline decoration-rose-800/30'
              >
                admin@rentmyvenue.com
              </a>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <div className="bg-white/10 border border-white/20 p-2 rounded flex-1 text-center">
              <p className="text-[7px] uppercase text-white/60">Download</p>
              <p className="font-bold text-[9px]">App Store</p>
            </div>
            <div className="bg-white/10 border border-white/20 p-2 rounded flex-1 text-center">
              <p className="text-[7px] uppercase text-white/60">Download</p>
              <p className="font-bold text-[9px]">Google Play</p>
            </div>
          </div>
        </div>

      </div>

      <div className="text-center pt-8 text-white/40 text-[10px] tracking-[4px] font-black uppercase">
        © COPYRIGHT 2026 BY RENTMYVENUE.
      </div>
    </footer>
  );
};

export default Footer;