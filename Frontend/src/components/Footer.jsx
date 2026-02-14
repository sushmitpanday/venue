import React, { useState } from "react";
import { Users, ChevronDown, ChevronUp, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-black text-white font-sans pt-16 pb-6 text-[12px]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-zinc-800 pb-12 items-start">
        
        {/* LEFT: Legal & Shipping Sections (Saara Content Yahan Hai) */}
        <div className="space-y-6 md:col-span-1">
          {/* 1. Terms and Conditions */}
          <div className="space-y-3 normal-case">
            <button 
              onClick={() => toggleSection('terms')}
              className="flex items-center justify-between w-full text-lg font-bold text-cyan-400 border-b border-zinc-800 pb-2 cursor-pointer"
            >
              Terms and Conditions
              {openSection === 'terms' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSection === 'terms' && (
              <div className="mt-4 space-y-3 text-zinc-300 leading-relaxed transition-all duration-300">
                <p><strong>Effective Date:</strong> [Insert Date]</p>
                <p>Welcome to RentMyVenue.com (“Website”, “we”, “us”, or “our”). These Terms govern your use of our platform connecting Hosts and Guests.</p>
                <p>By accessing or using RentMyVenue.com, you agree to be bound by these Terms and our Privacy Policy.</p>
                <p><strong>1. Eligibility:</strong> Must be at least 18 years old and legally capable of entering a binding contract.</p>
                <p><strong>2. User Accounts:</strong> Users must register, maintain confidentiality of login details, and provide accurate information.</p>
                <p><strong>3. Listings & Bookings:</strong> Hosts must provide accurate details. Bookings require Host approval.</p>
                <p><strong>4. Payments:</strong> Payment terms, deposits, and cancellation charges are defined by Hosts.</p>
                <p><strong>5. Cancellations & Refunds:</strong> Refunds follow Host’s cancellation policy.</p>
                <p><strong>6. Responsibilities & Conduct:</strong> Guests must follow laws and venue rules. No false or illegal content allowed.</p>
                <p><strong>7. Limitation of Liability:</strong> We are facilitators and do not guarantee venue quality.</p>
                <p><strong>8. Intellectual Property:</strong> All website content is protected.</p>
                <p><strong>9. Termination:</strong> We may suspend or terminate accounts violating these Terms.</p>
                <p><strong>10. Changes to Terms:</strong> Continued use after updates constitutes acceptance.</p>
                <p><strong>11. Governing Law:</strong> Governed by laws of [Insert Jurisdiction].</p>
              </div>
            )}
          </div>

          {/* 2. Privacy Policy */}
          <div className="space-y-3 normal-case">
            <button 
              onClick={() => toggleSection('privacy')}
              className="flex items-center justify-between w-full text-lg font-bold text-cyan-400 border-b border-zinc-800 pb-2 cursor-pointer"
            >
              Privacy Policy
              {openSection === 'privacy' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSection === 'privacy' && (
              <div className="mt-4 space-y-3 text-zinc-300 leading-relaxed">
                <p><strong>Effective Date:</strong> [Insert Date]</p>
                <p><strong>1. Information We Collect:</strong> Personal (Name, email, phone) and Non-Personal (Browser type, IP address).</p>
                <p><strong>2. How We Use Information:</strong> To facilitate bookings, verify identity, and prevent fraud.</p>
                <p><strong>3. Sharing of Information:</strong> We do not sell personal data. Shared only with Hosts/Guests or law enforcement.</p>
                <p><strong>4. Cookies & Tracking:</strong> Used for sessions, analytics, and storing preferences.</p>
                <p><strong>5. Data Security:</strong> Administrative, technical, and physical safeguards implemented.</p>
                <p><strong>6. Your Rights:</strong> You may access, correct, or delete personal data. Contact: <a href="mailto:privacy@rentmyvenue.com" className="text-blue-500 underline">privacy@rentmyvenue.com</a></p>
                <p><strong>7. Children’s Privacy:</strong> Not intended for users under 18.</p>
              </div>
            )}
          </div>

          {/* 4. Shipping Policy (Content Recovered) */}
          <div className="space-y-3 normal-case">
            <button 
              onClick={() => toggleSection('shipping')}
              className="flex items-center justify-between w-full text-lg font-bold text-cyan-400 border-b border-zinc-800 pb-2 cursor-pointer"
            >
              Shipping & Delivery
              {openSection === 'shipping' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSection === 'shipping' && (
              <div className="mt-4 space-y-3 text-zinc-300 leading-relaxed">
                <p><strong>Last Updated:</strong> [Insert Date]</p>
                <p>RentMyVenue.com provides digital reservation services. No physical goods are shipped.</p>
                <p><strong>Service Delivery:</strong> Booking confirmation is sent via email and visible in dashboard.</p>
                <p><strong>Access:</strong> Venue access depends on Host rules and check-in/out timings.</p>
                <p><strong>Third-Party:</strong> Add-ons like catering are handled by venue providers.</p>
              </div>
            )}
          </div>
        </div>

        {/* BEECH MEIN: Agent Portal */}
        <div className="md:col-span-2 flex flex-col items-center text-center px-4 pt-2">
          <h3 className="text-lg font-black normal-case mb-6 tracking-tighter italic text-purple-400">
            Agent Portal
          </h3>
          <p className="text-zinc-500 normal-case mb-6 text-[11px] leading-tight max-w-xs">
            Earn commission by listing venues with us.
          </p>
          <div className="space-y-4 w-full max-w-xs">
            <Link
              to="/agent-register"
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-5 py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all w-full justify-center font-black tracking-widest group"
            >
              <Users size={16} />
              JOIN AS AGENT
            </Link>
            <Link
              to="/agent-login"
              className="block text-center text-zinc-500 hover:text-white transition-colors font-bold tracking-[2px] text-[10px]"
            >
              ALREADY AN AGENT? LOGIN
            </Link>
          </div>
        </div>

        {/* RIGHT MEIN: Address/Contact (Image wala Content) */}
        <div className="md:col-span-1 order-last md:order-none space-y-6 pt-2">
          <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-2">Contact Us</h3>
          
          <div className="space-y-5 text-zinc-300">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">6391 Elgin St. Celina, New York, United States of America</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-cyan-400 shrink-0" />
              <p className="font-semibold">(303) 555-0105</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={20} className="text-cyan-400 shrink-0" />
              <p className="break-all text-[11px]">venue.support@example.com</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <div className="bg-zinc-900 border border-zinc-800 p-2 rounded flex-1 text-center">
              <p className="text-[7px] uppercase text-zinc-500">Download</p>
              <p className="font-bold text-[9px]">App Store</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-2 rounded flex-1 text-center">
              <p className="text-[7px] uppercase text-zinc-500"></p>
              <p className="font-bold text-[9px]">Google Play</p>
            </div>
          </div>
        </div>

      </div>

      <div className="text-center pt-8 text-zinc-600 text-[10px] tracking-[4px] font-black">
        © COPYRIGHT 2026 BY RENTMYVENUE.
      </div>
    </footer>
  );
};

export default Footer;