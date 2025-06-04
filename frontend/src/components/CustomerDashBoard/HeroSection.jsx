import React from 'react';
import Hero from "../../assets/Hero_Section.png";

const HeroSection = () => {
  return (
    <div className="py-6 px-8 lg:py-16 lg:px-25">
      <div className="relative w-full h-64 mb-8 overflow-hidden rounded-xl">
        <img
          src={Hero}
          alt="Fresh Groceries"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/70 to-transparent flex items-center">
          <div className="px-10 text-white">
            <h1 className="text-4xl font-bold mb-2">Fresh Groceries</h1>
            <p className="text-xl mb-4">Delivered to your doorstep</p>
            <button className="px-6 py-2 bg-white text-green-700 rounded-md font-medium hover:bg-green-50 transition-colors">
              Browse Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;