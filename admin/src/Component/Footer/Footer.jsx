import React from 'react';

const Footer = () => {
    return (
        <div className='bg-[#e6f0ff] py-8'>
            <div className="flex flex-col gap-5">
                
                {/* Logo + Brand Name */}
                <div className="flex flex-col items-center">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/891/891462.png" 
                        alt="logo" 
                        className="h-12 w-12 object-contain"
                    />
                    <h1 className='font-bold text-xl'>Shopper</h1>
                </div>

                {/* Navigation Links */}
                <ul className='flex gap-4 justify-center font-bold text-gray-700'>
                    <li>Company</li>
                    <li>Products</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                </ul>

                {/* Social Icons */}
                <div className="flex justify-center items-center gap-5 mt-4">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp"
                        className="h-10 w-10 rounded-full p-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                    />
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                        alt="Facebook"
                        className="h-10 w-10 rounded-full p-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                    />
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                        alt="Email"
                        className="h-10 w-10 rounded-full p-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                    />
                </div>

            </div>
        </div>
    );
};

export default Footer;
