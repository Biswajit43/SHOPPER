import React, { use } from 'react';
import heroImage from '../Assets/male.png';
import { Navigate, useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#f5f7fa] to-[#c3cfe2] py-14 px-6 md:px-20">
      
      {/* Left side */}
      <div className="left flex flex-col justify-center max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-sm">
          New Arrivals Only
        </h1>
        <p className="text-lg text-gray-700 mt-5 leading-relaxed">
          Explore the freshest styles of the season. Designed with elegance, made for comfort.
        </p>
        <button onClick={() => {navigate('/')}} className="mt-6 px-7 py-3 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-all duration-300 ease-in-out">
          Shop Now
        </button>
      </div>

      {/* Right side */}
      <div className="right mt-12 md:mt-0">
        <img 
          src={heroImage} 
          alt="New Arrival" 
          className="w-80 md:w-[420px] rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
        />
      </div>
    </div>
  );
};

export default Hero;
