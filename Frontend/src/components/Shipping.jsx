import React from 'react';
import { Mail, CalendarCheck, Clock, Utensils, Send } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-800 pb-20">
      {/* Header Section */}
      <header className="bg-black py-16 px-6 text-center border-b-4 border-cyan-400">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Shipping & <span className="text-cyan-400">Delivery</span>
        </h1>
        <p className="text-zinc-400 text-sm tracking-widest uppercase font-medium">
          Last Updated: February 20, 2026
        </p>
      </header>

      {/* Main Content Card */}
      <main className="max-w-4xl mx-auto px-8 py-12 bg-white -mt-10 shadow-2xl rounded-xl border border-zinc-200">
        
        {/* Digital Service Alert */}
        <div className="mb-12 p-6 bg-cyan-50 border-2 border-dashed border-cyan-200 rounded-2xl flex items-center gap-4">
          <div className="bg-cyan-500 text-white p-3 rounded-full">
            <Send size={24} />
          </div>
          <p className="text-cyan-900 font-medium leading-relaxed">
            RentMyVenue.com provides <span className="font-bold underline">digital reservation services</span>. 
            No physical goods are shipped to your address.
          </p>
        </div>

        <div className="space-y-10">
          
          {/* Section 1: Service Delivery */}
          <section className="relative pl-12 border-l-2 border-zinc-100">
            <div className="absolute -left-[17px] top-0 bg-white p-1">
              <div className="bg-black text-cyan-400 p-2 rounded-lg shadow-md">
                <Mail size={20} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-black mb-2 uppercase tracking-tight">
              Service Delivery
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              Once your booking is confirmed by the Host, a digital confirmation is sent via 
              <span className="font-semibold text-zinc-900"> email</span>. Your booking details and invoice will also be instantly visible in your 
              <span className="font-semibold text-zinc-900"> user dashboard</span>.
            </p>
          </section>

          {/* Section 2: Access */}
          <section className="relative pl-12 border-l-2 border-zinc-100">
            <div className="absolute -left-[17px] top-0 bg-white p-1">
              <div className="bg-black text-cyan-400 p-2 rounded-lg shadow-md">
                <Clock size={20} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-black mb-2 uppercase tracking-tight">
              Venue Access
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              Physical access to the venue is strictly dependent on the 
              <span className="font-semibold text-zinc-900"> Host's specific rules</span> and the 
              <span className="font-semibold text-zinc-900"> check-in/out timings</span> selected during the booking process.
            </p>
          </section>

          {/* Section 3: Third-Party */}
          <section className="relative pl-12 border-l-2 border-zinc-100">
            <div className="absolute -left-[17px] top-0 bg-white p-1">
              <div className="bg-black text-cyan-400 p-2 rounded-lg shadow-md">
                <Utensils size={20} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-black mb-2 uppercase tracking-tight">
              Third-Party Services
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              Add-ons such as catering, decoration, or photography are handled and delivered directly by the 
              <span className="font-semibold text-zinc-900"> venue providers</span> or their authorized partners.
            </p>
          </section>

        </div>

        {/* Support Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-100 flex flex-col items-center">
          <p className="text-zinc-400 text-sm mb-6 text-center">
            Need help with your booking delivery? <br />
            <span className="text-black font-bold">Our support team is active 24/7.</span>
          </p>
          <button 
            onClick={() => window.location.href = "/"} 
            className="group flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all duration-300"
          >
            Got it, thanks!
          </button>
        </div>
      </main>
    </div>
  );
};

export default Shipping;