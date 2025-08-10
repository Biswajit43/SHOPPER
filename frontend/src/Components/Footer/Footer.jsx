import React from 'react'
import wpicon from '../Assets/whatsapp_icon.png'
import fb from '../Assets/facebook.png'
import mail from '../Assets/mail.png'
import logo from '../Assets/logo.png';
const Footer = () => {
    return (
        <div className='bg-[#e6f0ff] py-8'>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col  items-center">
                    <img src={logo} />
                    <h1 className='font-bold'>Shopper</h1>
                </div>
                <ul className='flex gap-4 justify-center font-bold'>
                    <li>company</li>
                    <li>Products</li>
                    <li>About us</li>
                    <li>contact us</li>
                </ul>
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
    )
}
export default Footer
