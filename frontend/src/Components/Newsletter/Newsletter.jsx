import React from 'react';

const Newsletter = () => {
  return (
    <div className="bg-gradient-to-r from-[#e6f0ff] via-[#f9fbff] to-[#d0e2ff] min-h-[60vh] flex flex-col items-center justify-center px-6 md:px-20 py-14 text-center gap-4">
      
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#002147]">
        Get Exclusive Offers In Your Inbox
      </h1>
      
      {/* Subheading */}
      <h2 className="text-lg md:text-xl text-gray-600">
        Subscribe to our newsletter and stay updated
      </h2>
      
      {/* Input and Button */}
      <div className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full max-w-xl">
        <input
          type="email"
          placeholder="Enter your email..."
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition w-full md:w-auto">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
