// components/Footer.js
import React from "react";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const links = ["Hotel Room", "Restaurant", "Privacy Policy", "About Us", "Contact Us"];
  return (
   <footer className="bg-[#031930] text-white font-sans pt-16 pb-6 uppercase text-[12px]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
        
        {/* 1. About Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold normal-case">About</h3>
          <p className="text-gray-400 normal-case leading-relaxed text-[13px]">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.
          </p>
          <div className="relative max-w-[280px]">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-[#052b52] border border-white/10 py-3 px-4 pr-10 rounded-sm focus:outline-none focus:border-cyan-400 transition-all text-xs"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-white transition-colors">
              <Send size={16} />
            </button>
          </div>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <div key={i} className="bg-white/10 p-2 rounded-full cursor-pointer hover:bg-cyan-500 transition-all">
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Quick Links Section */}
        <div className="md:pl-10">
          <h3 className="text-lg font-bold normal-case mb-6">Links</h3>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link}>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors tracking-widest block">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Contact Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold normal-case">Contact</h3>
          <div className="space-y-4 text-gray-400 normal-case">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-cyan-400 shrink-0" />
              <span>6391 Elgin St. Celina, Delaware New York. USA</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-cyan-400 shrink-0" />
              <span>(303) 555-0105</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-cyan-400 shrink-0" />
              <span className="lowercase">michael.mitc@example.com</span>
            </div>
          </div>
          
          {/* App Store Buttons */}
          <div className="flex gap-3 pt-2">
            <button className="bg-black/40 border border-white/10 px-4 py-2 rounded flex items-center gap-2 hover:bg-white/5 transition-all">
              <div className="text-left">
                <p className="text-[8px] opacity-60">Download on the</p>
                <p className="text-[10px] font-bold">App Store</p>
              </div>
            </button>
            <button className="bg-black/40 border border-white/10 px-4 py-2 rounded flex items-center gap-2 hover:bg-white/5 transition-all">
              <div className="text-left">
                <p className="text-[8px] opacity-60">GET IT ON</p>
                <p className="text-[10px] font-bold">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="text-center pt-8 text-gray-500 text-[10px] tracking-widest">
        © COPYRIGHT 2026 BY SOLINOM HTML TEMPLATE.
      </div>
    </footer>
  );
};

export default Footer;
