// components/FeaturedVenues.js
import React from "react";

const venues = [
  { name: "The Grand Ballroom", location: "Delhi", image: "/assets/venue2.jpg" },
  { name: "Royal Banquet", location: "Gurgaon", image: "/assets/venue3.jpg" },
  { name: "Sunset Gardens", location: "Noida", image: "/assets/venue1.jpg" },
];

const FeaturedVenues = () => {
  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">Featured Venues</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
        {venues.map((venue, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
              <p className="text-gray-600 mb-4">{venue.location}</p>
              <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedVenues;
