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
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="flex justify-between items-center px-3 sm:px-6 py-3 relative">

                {/* Logo & Brand */}
                <div className="flex items-center gap-2">
                    <img src={logo} alt="logo" className="h-8 sm:h-10 w-auto object-contain" />
                    <p className="text-lg sm:text-xl font-semibold text-gray-800">Shopper</p>
                </div>

                {/* Right Actions - Mobile Priority */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Login/Logout - Hidden on mobile, shown on tablet+ */}
                    <div className="hidden md:block">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="font-medium border border-gray-300 rounded px-3 sm:px-4 py-1 sm:py-2 text-sm hover:bg-gray-100 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="font-medium bg-blue-600 text-white rounded px-3 sm:px-4 py-1 sm:py-2 text-sm hover:bg-blue-700 transition"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Cart Button */}
                    <Link to="/cart" className="relative p-1">
                        <img className="h-6 w-6 sm:h-8 sm:w-8" src={cart} alt="cart" />
                        {sum > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] rounded-full flex items-center justify-center text-[10px] sm:text-xs">
                                {sum > 99 ? '99+' : sum}
                            </span>
                        )}
                    </Link>

                    {/* Hamburger Menu */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-5 h-4 flex flex-col justify-between">
                            <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex gap-6 text-gray-700 font-medium absolute left-1/2 transform -translate-x-1/2">
                    {navitem.map((item) => (
                        <li
                            key={item}
                            onClick={() => setactive(item)}
                            className={`cursor-pointer pb-1 border-b-2 transition-all duration-200 hover:text-blue-600 ${
                                active === item ? 'border-blue-600 text-blue-600' : 'border-transparent'
                            }`}
                        >
                            {item === "shop" ? (
                                <Link to="/">Shop</Link>
                            ) : (
                                <Link to={`/${item}`} className="capitalize">{item}</Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="bg-gray-50 border-t border-gray-200">
                    {/* Navigation Links */}
                    <ul className="py-2">
                        {navitem.map((item, index) => (
                            <li key={item}>
                                <div
                                    onClick={() => {
                                        setactive(item);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer ${
                                        active === item ? 'bg-blue-50 text-blue-600 font-medium border-r-2 border-blue-600' : ''
                                    }`}
                                >
                                    {item === "shop" ? (
                                        <Link to="/" className="block w-full">Shop</Link>
                                    ) : (
                                        <Link to={`/${item}`} className="block w-full capitalize">{item}</Link>
                                    )}
                                </div>
                                {index < navitem.length - 1 && <div className="border-b border-gray-200 mx-6"></div>}
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Login/Logout */}
                    <div className="border-t border-gray-200 p-4">
                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
