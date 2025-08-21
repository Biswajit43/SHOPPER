import React, { useContext, useState, useEffect } from 'react';
import logo from '../Assets/logo.png';
import cart from '../Assets-folder/cart.png';
import { Link, useNavigate } from 'react-router-dom';
import { Shopcontext } from '../../Context/Shopcontext';

const navitem = ["shop", "Men", "Women", "Kids"];

const Navbar = () => {
    const navigate = useNavigate();
    // ✅ 1. Get isLoggedIn and handleLogout directly from the context.
    const { all_product, carditem, isLoggedIn, handleLogout } = useContext(Shopcontext);

    const [sum, setSum] = useState(0);
    const [active, setactive] = useState("shop");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ❌ 2. Remove the local state for isLoggedIn and its useEffect.
    // const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    // useEffect(() => { ... }); // This effect is no longer needed.

    // This useEffect for calculating the cart total is correct.
    useEffect(() => {
        let total = 0;
        if (all_product && carditem) {
            all_product.forEach((item) => {
                total += carditem[item.id] || 0;
            });
        }
        setSum(total);
    }, [all_product, carditem]);
    
    // ❌ 3. Remove the local handleLogout function. We'll use the one from the context.
    // const handleLogout = () => { ... };

    return (
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="flex justify-between items-center px-3 sm:px-6 py-3 relative">

                {/* Logo & Brand */}
                <div className="flex items-center gap-2">
                    <img src={logo} alt="logo" className="h-8 sm:h-10 w-auto object-contain" />
                    <p className="text-lg sm:text-xl font-semibold text-gray-800">Shopper</p>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Login/Logout Buttons for Desktop */}
                    <div className="hidden md:block">
                        {/* ✅ 4. This now uses the isLoggedIn from the context. It will update automatically. */}
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout} // Use handleLogout from context
                                className="font-medium border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="font-medium bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700 transition"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Cart Button */}
                    <Link to="/cart" className="relative p-1">
                        <img className="h-6 w-6 sm:h-8 sm:w-8" src={cart} alt="cart" />
                        {sum > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                                {sum > 99 ? '99+' : sum}
                            </span>
                        )}
                    </Link>

                    {/* Hamburger Menu Icon */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {/* Hamburger icon lines */}
                        <div className="w-5 h-4 flex flex-col justify-between">
                            <span className={`block h-0.5 w-full bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`block h-0.5 w-full bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-0.5 w-full bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex gap-6 text-gray-700 font-medium absolute left-1/2 transform -translate-x-1/2">
                    {navitem.map((item) => (
                        <li
                            key={item}
                            onClick={() => setactive(item)}
                            className={`cursor-pointer pb-1 border-b-2 transition-colors ${active === item ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
                        >
                            <Link to={item === "shop" ? "/" : `/${item}`} className="capitalize">{item}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="bg-gray-50 border-t">
                    {/* Mobile Navigation Links */}
                    <ul className="py-2">
                        {navitem.map((item) => (
                            <li key={item}>
                                <Link
                                    to={item === "shop" ? "/" : `/${item}`}
                                    onClick={() => { setactive(item); setIsMenuOpen(false); }}
                                    className={`block px-6 py-3 capitalize transition-colors ${active === item ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Login/Logout Buttons */}
                    <div className="p-4 border-t">
                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    handleLogout(); // Use handleLogout from context
                                    setIsMenuOpen(false);
                                }}
                                className="w-full bg-red-500 text-white py-3 rounded-lg font-medium"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
