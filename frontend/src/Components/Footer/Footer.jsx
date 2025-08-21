import React from 'react';
import wpicon from '../Assets/whatsapp_icon.png';
import fb from '../Assets/facebook.png';
import mail from '../Assets/mail.png';
import logo from '../Assets/logo.png';

const Footer = () => {
    const menuItems = ["Company", "Products", "About Us", "Contact Us"];

    return (
        <div className='bg-[#e6f0ff] py-8'>
            <div className="flex flex-col gap-5">
                
                {/* Logo Section */}
                <div className="flex flex-col items-center">
                    <img src={logo} alt="Shopper Logo" className="h-12" />
                    <h1 className='font-bold text-lg'>Shopper</h1>
                </div>

                {/* Menu Items */}
                <ul className='flex gap-6 justify-center font-bold text-gray-800 text-center'>
                    {menuItems.map((item, index) => (
                        <li key={index} className="cursor-pointer hover:text-blue-600 transition-colors duration-300">
                            {item}
                        </li>
                    ))}
                </ul>

                {/* Social Media Icons */}
                <div className="flex justify-center items-center gap-5 mt-4">
                    <img
                        src={wpicon}
                        alt="WhatsApp"
                        className="h-10 w-10 rounded-full p-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                    />
                    <img
                        src={fb}
                        alt="Facebook"
                        className="h-10 w-10 rounded-full p-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                    />
                    <img
                        src={mail}
                        alt="Email"
                        className="h-10 w-10 rounded-full p-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                    />
                </div>
            </div>
        </div>
    );
};

export default Footer;
