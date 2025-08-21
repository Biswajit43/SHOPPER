import React, { useContext, useEffect, useState } from 'react';
import { Shopcontext } from '../../Context/Shopcontext';
import { useParams, useNavigate } from 'react-router-dom';

const Productdisplay = (props) => {
    const { addtocart, user } = useContext(Shopcontext); // Assuming user is managed in context
    const { productid } = useParams();
    const { product } = props;
    const navigate = useNavigate();

    // Default size selection
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [productid]);

    if (!product) {
        return (
            <p className="text-red-500 text-center p-4 text-lg">
                Product not found!
            </p>
        );
    }

    const handleAddToCart = () => {
        addtocart(product.id, selectedSize);

        if (!user) {
            // If user not logged in, navigate to login
            navigate('/login');
        } else {
            // If logged in, show toast instead of redirect
            alert(`${product.name} added to cart!`);
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <div className="flex flex-col items-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-sm w-full rounded-xl shadow-md"
                />
            </div>

            {/* Right Column: Info */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>

                {/* Price */}
                <div className="flex items-center gap-4">
                    <span className="text-green-600 text-xl font-semibold">₹{product.new_price}</span>
                    <span className="text-gray-400 line-through text-lg">₹{product.old_price}</span>
                </div>

                {/* Size Options (Dynamic) */}
                {product.sizes && product.sizes.length > 0 && (
                    <div>
                        <p className="font-semibold mb-2">Select Size:</p>
                        <div className="flex gap-3">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 rounded-full border transition-colors ${
                                        selectedSize === size
                                            ? 'bg-black text-white'
                                            : 'bg-white text-black hover:bg-gray-100'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform duration-200 hover:scale-105"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default Productdisplay;
