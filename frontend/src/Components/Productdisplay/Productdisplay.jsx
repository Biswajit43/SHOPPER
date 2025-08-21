import React, { useContext, useEffect, useState } from 'react';
import { Shopcontext } from '../../Context/Shopcontext';
import { useParams, useNavigate } from 'react-router-dom';

const Productdisplay = (props) => {
    const { addtocart, user } = useContext(Shopcontext);
    const { productid } = useParams();
    const { product } = props;
    const navigate = useNavigate();
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [productid]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-500 text-2xl font-bold">!</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h3>
                    <p className="text-gray-600">The product you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addtocart(product.id, selectedSize);
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            alert(`${product.name} added to cart!`);
        }
    };

    // Calculate discount percentage
    const discount = product.old_price ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        
                        {/* Left Column: Product Image */}
                        <div className="flex justify-center items-center">
                            <div className="relative group w-full max-w-lg">
                                {/* Discount Badge */}
                                {discount > 0 && (
                                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        -{discount}% OFF
                                    </div>
                                )}
                                
                                {/* Image Container */}
                                <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 hover:shadow-3xl transition-shadow duration-500">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Product Info */}
                        <div className="space-y-8 flex flex-col justify-center lg:pl-8">
                            
                            {/* Product Name */}
                            <div className="space-y-4">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                                    {product.name}
                                </h1>
                                
                                {/* Rating Section */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">(4.8) • 324 reviews</span>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-4 flex-wrap">
                                    <span className="text-4xl sm:text-5xl font-bold text-green-600">
                                        ₹{product.new_price?.toLocaleString()}
                                    </span>
                                    {product.old_price && (
                                        <span className="text-xl sm:text-2xl text-gray-400 line-through">
                                            ₹{product.old_price?.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Save ₹{(product.old_price - product.new_price)?.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Limited time offer
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Size Options */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-semibold text-gray-900">Select Size</p>
                                        <button className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors">
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`aspect-square flex items-center justify-center rounded-xl border-2 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 ${
                                                    selectedSize === size
                                                        ? 'bg-black text-white border-black shadow-lg shadow-black/25'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedSize && (
                                        <p className="text-sm text-gray-600">
                                            Selected size: <span className="font-semibold text-gray-900">{selectedSize}</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <div className="pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full sm:w-auto min-w-[200px] px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-2 2h-6"></path>
                                        </svg>
                                        Add to Cart
                                    </span>
                                </button>
                            </div>

                            {/* Product Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                                        </svg>
                                    </div>
                                    <span className="font-medium">Free Delivery</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 12.75l6 6 9-13.5"></path>
                                        </svg>
                                    </div>
                                    <span className="font-medium">Easy Returns</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    </div>
                                    <span className="font-medium">Secure Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Productdisplay;
