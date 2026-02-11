import React from "react";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube, Users } from 'lucide-react';
import { Link } from 'react-router-dom'; // Link import karna zaroori hai

const Footer = () => {
  const links = ["Hotel Room", "Restaurant", "Privacy Policy", "About Us", "Contact Us"];
  
  return (
    <footer className="bg-black text-white font-sans pt-16 pb-6 uppercase text-[12px]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-zinc-800 pb-12">
        
        {/* 1. About Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-black normal-case tracking-tighter">About <span className="text-cyan-400">Venue</span></h3>
          <p className="text-zinc-500 normal-case leading-relaxed text-[13px] font-medium">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.
          </p>
          <div className="relative max-w-[280px]">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-zinc-900 border border-zinc-800 py-3 px-4 pr-10 rounded-lg focus:outline-none focus:border-cyan-400 transition-all text-xs text-white placeholder:text-zinc-600"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-white transition-colors">
              <Send size={16} />
            </button>
          </div>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <div key={i} className="bg-zinc-900 p-2.5 rounded-full cursor-pointer hover:bg-cyan-500 hover:text-black transition-all border border-zinc-800">
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Quick Links Section */}
        <div className="">
          <h3 className="text-lg font-black normal-case mb-6 tracking-tighter">Quick Links</h3>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link}>
                <a href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors tracking-widest block font-bold text-[11px]">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* --- NAYA AGENT SECTION --- */}
        <div className="">
          <h3 className="text-lg font-black normal-case mb-6 tracking-tighter italic text-purple-400">Agent Portal</h3>
          <p className="text-zinc-500 normal-case mb-4 text-[11px] leading-tight">Earn commission by listing venues with us.</p>
          <div className="space-y-4">
            <Link to="/agent-register" className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-5 py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all w-full justify-center font-black tracking-widest group">
              <Users size={16} className="group-hover:scale-110 transition-transform" />
              JOIN AS AGENT
            </Link>
            <Link to="/agent-login" className="block text-center text-zinc-500 hover:text-white transition-colors font-bold tracking-[2px] text-[10px]">
              ALREADY AN AGENT? LOGIN
            </Link>
          </div>
        </div>

        {/* 4. Contact Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-black normal-case tracking-tighter">Contact Us</h3>
          <div className="space-y-4 text-zinc-400 normal-case font-medium">
            <div className="flex items-start gap-3 group">
              <MapPin size={18} className="text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors text-[11px]">6391 Elgin St. Celina, New York. USA</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Phone size={18} className="text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors text-[11px]">(303) 555-0105</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Mail size={18} className="text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="lowercase group-hover:text-white transition-colors text-[11px]">venue.support@example.com</span>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all">
              <div className="text-left">
                <p className="text-[7px] opacity-50 tracking-tighter">Download on the</p>
                <p className="text-[10px] font-black uppercase">App Store</p>
              </div>
            </button>
            <button className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all">
              <div className="text-left">
                <p className="text-[7px] opacity-50 tracking-tighter">GET IT ON</p>
                <p className="text-[10px] font-black uppercase">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="text-center pt-8 text-zinc-600 text-[10px] tracking-[4px] font-black">
        © COPYRIGHT 2026 BY RENTMYVENUE.
      </div>
    </footer>
  );
};

export default Footer;