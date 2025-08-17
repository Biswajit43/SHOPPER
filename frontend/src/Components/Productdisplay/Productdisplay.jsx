import React, { useContext, useEffect, useState } from 'react';
import { Shopcontext } from '../../Context/Shopcontext';
import { useParams, useNavigate } from 'react-router-dom';

const Productdisplay = (props) => {
    const { addtocart } = useContext(Shopcontext);
    const { productid } = useParams();
    const { product } = props;
    const navigate = useNavigate();

    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');

    // Effect to scroll to top on product change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [productid]);

    // Handle case where product data is not yet available
    if (!product) {
        return <p className="text-red-500 text-center p-4">Product not found</p>;
    }

    // Handler for the "Add to Cart" button
    const handleAddToCart = () => {
        const authToken = localStorage.getItem('auth-token');
        if (authToken) {
            addtocart(product.id);
            alert(`${product.name} added to cart!`);
        } else {
            alert('Please create an account or log in to add items to your cart.');
            navigate('/login');
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <div className="flex flex-col items-center">
                {/* Thumbnail Gallery (Dynamic) */}
                <div className="flex gap-2 mb-4">
                    {product.images && product.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`${product.name} preview ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                        />
                    ))}
                </div>

                {/* Main Image */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-sm w-full rounded-xl shadow-md"
                />
            </div>

            {/* Right Column: Info */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>

                {/* Rating Stars (Dynamic) */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < product.rating ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}>★</span>
                    ))}
                    <span className="text-gray-600 text-sm">({product.reviewCount || 0} ratings)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                    <span className="text-green-600 text-xl font-semibold">₹{product.new_price}</span>
                    <span className="text-gray-400 line-through text-lg">₹{product.old_price}</span>
                </div>

                {/* Size Options (Dynamic) */}
                <div>
                    <p className="font-semibold mb-2">Select Size:</p>
                    <div className="flex gap-3">
                        {product.sizes && product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 rounded-full border ${
                                    selectedSize === size
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border-gray-400'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add to Cart Button with Auth Check */}
                <button
                    onClick={handleAddToCart}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default Productdisplay;
