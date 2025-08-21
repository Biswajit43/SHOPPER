import React, { useContext, useEffect, useState } from 'react';
import logo from '../Assets/logo.png';
import cart from '../Assets/cart.png';
import { Link, useNavigate } from 'react-router-dom';
import { Shopcontext } from '../../Context/Shopcontext';

const navitem = ["shop", "Men", "Women", "Kids"];

const Navbar = () => {
    const navigate = useNavigate();
    const { all_product, carditem } = useContext(Shopcontext);

    const [sum, setSum] = useState(0);
    const [active, setactive] = useState("shop");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    // Update cart count dynamically without reload
    useEffect(() => {
        let total = 0;
        all_product.forEach((item) => {
            total += carditem[item.id] || 0;
        });
        setSum(total);
    }, [all_product, carditem]);

    // Update login state on token change
    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
        };
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="flex justify-between items-center border border-gray-300 px-4 sm:px-6 py-3 bg-white shadow-sm relative">

            {/* Logo & Brand */}
            <div className="flex items-center gap-2">
                <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
                <p className="text-xl font-semibold text-gray-800">Shopper</p>
            </div>

            {/* Hamburger Menu for Mobile */}
            <button
                className="sm:hidden text-gray-700 text-2xl focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                ☰
            </button>

            {/* Navigation Links */}
            <ul
                className={`sm:flex gap-6 text-gray-700 font-medium absolute sm:static bg-white sm:bg-transparent w-full sm:w-auto top-16 left-0 sm:top-0 transition-all duration-300 sm:opacity-100 ${isMenuOpen ? 'opacity-100 visible p-4 border-t sm:border-none shadow-md' : 'opacity-0 sm:opacity-100 invisible sm:visible'}`}
            >
                {navitem.map((item) => (
                    <li
                        key={item}
                        onClick={() => {
                            setactive(item);
                            setIsMenuOpen(false);
                        }}
                        className={`cursor-pointer pb-2 sm:pb-1 border-b-2 sm:border-b-2 transition-all duration-200 ${active === item ? 'border-blue-600 text-blue-600' : 'border-transparent'
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
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="font-medium border border-gray-300 rounded px-4 py-1 hover:bg-gray-100 transition"
                    >
                        logout
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="font-medium border border-gray-300 rounded px-4 py-1 hover:bg-gray-100 transition"
                    >
                        login
                    </button>
                )}

                <button className="relative">
                    <Link to={'/cart'}>
                        <img className="h-8 w-8" src={cart} alt="cart" />
                    </Link>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                        {sum}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Navbar;
