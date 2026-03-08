import React from 'react'

function Terms() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-800 pb-20">
      {/* Header Section */}
      <header className="bg-black py-16 px-6 text-center border-b-4 border-cyan-400">
         <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          ADDY MEDIA<span className="text-cyan-400">TECH LLP</span>
        </h1>
        <h5 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Terms and <span className="">Conditions</span>
        </h5>
        <p className="text-zinc-400 text-sm tracking-widest uppercase font-medium">
          Effective Date: February 20, 2026
        </p>
      </header>

      {/* Main Content Card */}
      <main className="max-w-4xl mx-auto px-8 py-12 bg-white -mt-10 shadow-2xl rounded-xl border border-zinc-200">
        
        {/* Intro Section */}
        <div className="mb-12 p-6 bg-zinc-900 text-zinc-300 rounded-lg border-l-8 border-cyan-400">
          <p className="leading-relaxed">
            Welcome to <span className="font-bold text-cyan-400">RentMyVenue.com</span> (“Website”, “we”, “us”, or “our”). These Terms govern your use of our platform connecting Hosts and Guests.
          </p>
          <p className="mt-4 font-semibold text-white">
            By accessing or using RentMyVenue.com, you agree to be bound by these Terms and our Privacy Policy.
          </p>
        </div>

        {/* 11 Points Grid/List */}
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">1</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Eligibility</h2>
              <p className="text-zinc-600 leading-relaxed">Must be at least 18 years old and legally capable of entering a binding contract.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">2</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">User Accounts</h2>
              <p className="text-zinc-600 leading-relaxed">Users must register, maintain confidentiality of login details, and provide accurate information.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">3</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Listings & Bookings</h2>
              <p className="text-zinc-600 leading-relaxed">Hosts must provide accurate details. Bookings require Host approval.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">4</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Payments</h2>
              <p className="text-zinc-600 leading-relaxed">Payment terms, deposits, and cancellation charges are defined by Hosts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">5</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Cancellations & Refunds</h2>
              <p className="text-zinc-600 leading-relaxed">Refunds follow Host’s cancellation policy.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">6</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Responsibilities & Conduct</h2>
              <p className="text-zinc-600 leading-relaxed">Guests must follow laws and venue rules. No false or illegal content allowed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">7</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Limitation of Liability</h2>
              <p className="text-zinc-600 leading-relaxed">We are facilitators and do not guarantee venue quality.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">8</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Intellectual Property</h2>
              <p className="text-zinc-600 leading-relaxed">All website content is protected.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">9</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Termination</h2>
              <p className="text-zinc-600 leading-relaxed">We may suspend or terminate accounts violating these Terms.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">10</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Changes to Terms</h2>
              <p className="text-zinc-600 leading-relaxed">Continued use after updates constitutes acceptance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[50px_1fr] gap-4">
            <span className="h-10 w-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg border border-cyan-200">11</span>
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Governing Law</h2>
              <p className="text-zinc-600 leading-relaxed">Governed by laws of Bareilly, Uttar Pradesh, India.</p>
            </div>
          </div>

        </div>

        {/* Closing */}
        <div className="mt-16 pt-8 border-t border-zinc-100 text-center">
          <button 
  onClick={() => window.location.href = "/"} 
  className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-cyan-500 transition-all duration-300 shadow-lg"
>
  I Accept
</button>
        </div>
      </main>
    </div>
  )
}

export default Terms