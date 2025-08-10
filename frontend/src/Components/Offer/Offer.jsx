import React from 'react'

import offerpic from '../Assets/exclusive_image.png'
const Offer = () => {
  return (
    <div className="bg-gradient-to-r from-[#e6f0ff] via-[#f9fbff] to-[#d0e2ff] min-h-screen flex items-center justify-center px-6 md:px-20 py-14">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-10">

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#002147] leading-tight mb-4">
            Unlock <span className="text-blue-600">Exclusive</span> Deals
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Enjoy our limited-time offer with up to <span className="font-semibold text-blue-700">50% OFF</span> on all premium products. Hurry before it ends!
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition">
            Explore Offers
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={offerpic}
            alt="Offer Visual"
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </div>

      </div>
    </div>
  )
}
export default Offer
