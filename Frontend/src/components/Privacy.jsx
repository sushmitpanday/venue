import React from 'react';
import { ShieldCheck, Lock, Eye, UserCheck, Cookie, Trash2 } from 'lucide-react'; // Icons ke liye lucide-react use kiya hai

const Privacy = () => {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-800 pb-20">
      {/* Header Section */}
      <header className="bg-black py-16 px-6 text-center border-b-4 border-cyan-400">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Privacy <span className="text-cyan-400">Policy</span>
        </h1>
        <p className="text-zinc-400 text-sm tracking-widest uppercase font-medium">
          Effective Date: February 20, 2026
        </p>
      </header>

      {/* Main Content Card */}
      <main className="max-w-4xl mx-auto px-8 py-12 bg-white -mt-10 shadow-2xl rounded-xl border border-zinc-200">
        
        {/* Security Badge */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 text-sm font-bold">
            <ShieldCheck size={20} /> Your data is safe with Rent My Venue
          </div>
        </div>

        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="flex gap-6">
            <div className="hidden md:block">
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <UserCheck size={24} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <span className="md:hidden text-cyan-500 font-bold">1.</span> Information We Collect
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                We collect <span className="font-semibold text-zinc-900">Personal Information</span> (such as your Name, email address, and phone number) and <span className="font-semibold text-zinc-900">Non-Personal Information</span> (including Browser type and IP address) to improve our services.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="flex gap-6">
            <div className="hidden md:block">
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <Eye size={24} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <span className="md:hidden text-cyan-500 font-bold">2.</span> How We Use Information
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                Your data is used to facilitate bookings between Hosts and Guests, verify your identity for security purposes, and prevent fraudulent activities on the platform.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="flex gap-6">
            <div className="hidden md:block">
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <Lock size={24} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <span className="md:hidden text-cyan-500 font-bold">3.</span> Sharing of Information
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                <span className="bg-yellow-100 px-1 font-medium">We do not sell your personal data.</span> Information is shared only with Hosts/Guests to complete a booking or with law enforcement agencies if required by law.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="flex gap-6">
            <div className="hidden md:block">
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <Cookie size={24} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <span className="md:hidden text-cyan-500 font-bold">4.</span> Cookies & Tracking
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                We use cookies to maintain your login sessions, analyze website traffic, and store your preferences for a more personalized experience.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="flex gap-6">
            <div className="hidden md:block">
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <ShieldCheck size={24} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <span className="md:hidden text-cyan-500 font-bold">5.</span> Data Security
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                We implement industry-standard administrative, technical, and physical safeguards to protect your data from unauthorized access or theft.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="flex gap-6">
            <div className="hidden md:block">
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <Trash2 size={24} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <span className="md:hidden text-cyan-500 font-bold">6.</span> Your Rights
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                You have the right to access, correct, or delete your personal data. For any such requests, please contact us at: 
                <span className="block mt-2 font-bold text-cyan-600 underline">privacy@rentmyvenue.com</span>
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="flex gap-6 border-t pt-8">
            <div>
              <h2 className="text-xl font-bold text-black mb-2 flex items-center gap-2 uppercase text-sm tracking-widest text-red-500">
                Children’s Privacy
              </h2>
              <p className="text-zinc-600 leading-relaxed italic">
                Our services are not intended for or directed towards users under the age of 18. We do not knowingly collect data from minors.
              </p>
            </div>
          </section>

        </div>

        {/* Action Button */}
        <div className="mt-16 text-center">
          <button 
            onClick={() => window.location.href = "/"} 
            className="px-10 py-4 bg-cyan-500 text-white font-black rounded-full hover:bg-black transition-all duration-300 shadow-xl uppercase tracking-widest"
          >
            I Understand
          </button>
        </div>
      </main>
    </div>
  );
};

export default Privacy;