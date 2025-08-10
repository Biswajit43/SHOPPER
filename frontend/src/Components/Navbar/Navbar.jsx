import React, { useContext, useState } from 'react';
import logo from '../Assets/logo.png';
import cart from '../Assets/cart.png';
import { Link, useNavigate } from 'react-router-dom';
// import { Shopcontext } from '../../context/Shopcontext';
import { Shopcontext } from '../../Context/Shopcontext';
const navitem = ["shop", "Men", "Women", "Kids"]; //created a array 
const Navbar = () => {
    const navigate = useNavigate();
    const { all_product, carditem, addtocart, removefromcart } = useContext(Shopcontext)
    let sum = 0;
    all_product.forEach((item) => {
        sum += carditem[item.id] || 0;
    })
    const [active, setactive] = useState("shop")
    return (
        <div className="flex justify-between items-center border border-gray-300 px-6 py-3 bg-white shadow-sm">

            {/* Logo & Brand */}
            <div className="flex items-center gap-2">
                <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
                <p className="text-xl font-semibold text-gray-800">Shopper</p>
            </div>

            {/* Navigation Links */}

            <ul className="flex gap-6 text-gray-700 font-medium">
                {navitem.map((item) => (
                    <li
                        key={item}
                        onClick={() => setactive(item)}
                        className={`cursor-pointer pb-1 border-b-2 transition-all duration-200 ${active === item ? 'border-blue-600 text-blue-600' : 'border-transparent'
                            }`}
                    >
                        {item === "shop" ? (
                            <Link to={`/`}>Shop</Link>
                        ) : (
                            <Link to={`/${item}`}>{item}</Link>
                        )}
                    </li>
                ))}
            </ul>


            {/* Right Actions */}
            <div className="flex items-center gap-4 relative">
                {localStorage.getItem('token') ? (<button onClick={
                    () => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                }
                    className="font-medium border border-gray-300 rounded px-4 py-1 hover:bg-gray-100 transition">
                    logout
                </button>) : (<button onClick={()=>{navigate('/login')}} className="font-medium border border-gray-300 rounded px-4 py-1 hover:bg-gray-100 transition">
                    login
                </button>)}

                <button className="relative">
                    <Link to={'/cart'}><img className="h-8 w-8" src={cart} alt="cart" /></Link>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                        {sum}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Navbar;
