import React, { useContext } from 'react';
import { Shopcontext } from '../../Context/Shopcontext';
import { useNavigate } from 'react-router-dom';

const Cartitem = () => {
    const navigate = useNavigate()
    const { all_product, carditem, addtocart, removefromcart } = useContext(Shopcontext);

    const findtotal = (all_product, carditem) => {
        let sum = 0;
        for (let i = 0; i < all_product.length; i++) {
            if (carditem[all_product[i].id] > 0) {
                sum += carditem[all_product[i].id] * all_product[i].new_price;
            }
        }
        return sum;
    }
    
    return (
        <div className="p-2 sm:p-4 min-h-screen bg-gray-50">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left px-2">Shopping Cart</h1>

            <div className="space-y-3 sm:space-y-4">
                {all_product.map((item) => {
                    if (carditem[item.id] > 0) {
                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-sm border p-3 sm:p-4"
                            >
                                {/* Mobile Layout - Stacked */}
                                <div className="sm:hidden">
                                    {/* Top Row - Image and Basic Info */}
                                    <div className="flex gap-3 mb-3">
                                        <div 
                                            onClick={() => navigate(`/product/${item.id}`)}
                                            className="w-20 h-20 flex-shrink-0 cursor-pointer"
                                        >
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-full h-full object-contain rounded"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-sm font-semibold line-clamp-2 mb-1">{item.name}</h2>
                                            <p className="text-sm text-green-600 font-medium">₹{item.new_price}</p>
                                            <p className="text-xs text-gray-500 line-through">₹{item.old_price}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom Row - Quantity Controls and Total */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => removefromcart(item.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="text-sm font-medium px-2">
                                                Qty: {carditem[item.id]}
                                            </span>
                                            <button
                                                onClick={() => addtocart(item.id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-700">
                                                ₹{item.new_price * carditem[item.id]}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout - Horizontal */}
                                <div className="hidden sm:flex items-center justify-between">
                                    {/* Product Image */}
                                    <div 
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        className="w-24 h-24 flex-shrink-0 mr-4 cursor-pointer"
                                    >
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-full h-full object-contain rounded"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
                                        <p className="text-sm text-green-600 font-medium">New Price: ₹{item.new_price}</p>
                                        <p className="text-sm text-gray-500 line-through">Old Price: ₹{item.old_price}</p>
                                    </div>

                                    {/* Quantity & Actions */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => removefromcart(item.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                        <span className="text-md font-medium">Qty: {carditem[item.id]}</span>
                                        <button
                                            onClick={() => addtocart(item.id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {/* Total */}
                                    <div className="ml-6 text-right">
                                        <h2 className="text-md font-bold text-blue-700">
                                            Total: ₹{item.new_price * carditem[item.id]}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Cart Summary */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-md mx-1 sm:mx-0">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
                    Cart Summary
                </h2>

                <div className="space-y-3 text-gray-700 font-medium mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base">Subtotal:</span>
                        <span className="text-sm sm:text-base font-semibold">₹{findtotal(all_product, carditem)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base">Shipping Fee:</span>
                        <span className="text-green-600 text-sm sm:text-base font-semibold">₹0</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3 text-base sm:text-lg font-bold text-blue-700">
                        <span>Total:</span>
                        <span>₹{findtotal(all_product, carditem)}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/paymentgateway', {
                        state: { amount: findtotal(all_product, carditem) },
                    })}
                    className="w-full bg-blue-600 text-white py-3 sm:py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-4 font-medium text-sm sm:text-base"
                >
                    Proceed to Checkout
                </button>

                {/* Promo Code Section */}
                <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                    <input
                        type="text"
                        placeholder="Enter promo code..."
                        className="w-full sm:flex-1 p-3 sm:p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    />
                    <button className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 sm:py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base">
                        Apply Code
                    </button>
                </div>
            </div>

            {/* Empty cart message */}
            {all_product.every(item => carditem[item.id] <= 0) && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 16a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm sm:text-base mb-6">Add some items to get started!</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cartitem;
