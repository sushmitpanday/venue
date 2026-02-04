// components/HeroSection.js
import React from "react";

const HeroSection = () => {
  return (
    <section
      className="bg-cover bg-center h-[500px] flex items-center justify-center text-white"
      style={{ backgroundImage: "url(assets/venue1.jpg)" }}
    >
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Find the Perfect Venue</h1>
        <p className="text-lg md:text-xl mb-6">Book banquet halls, party places & more</p>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by location or venue name"
            className="px-4 py-2 rounded-l-md w-72 focus:outline-none text-black border border-gray-300 bg-white"
          />
          <button className="bg-pink-600 px-6 py-2 rounded-r-md hover:bg-pink-700 transition">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
