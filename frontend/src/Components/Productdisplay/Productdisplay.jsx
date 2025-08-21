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
            <p className="text-red-500 text-center p-4 text-lg">
                Product not found!
            </p>
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

    return (
        <div className="p-4 sm:p-6 md:p-10 lg:p-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Product Image with Zoom Effect */}
            <div className="flex justify-center items-center group">
                <div className="overflow-hidden rounded-xl shadow-lg w-full max-w-sm">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="space-y-5 flex flex-col justify-center">
                {/* Product Name */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{product.name}</h2>

                {/* Price Section */}
                <div className="flex items-center gap-4">
                    <span className="text-green-600 text-xl sm:text-2xl font-semibold">
                        ₹{product.new_price}
                    </span>
                    <span className="text-gray-400 line-through text-lg sm:text-xl">
                        ₹{product.old_price}
                    </span>
                </div>

                {/* Size Options */}
                {product.sizes && product.sizes.length > 0 && (
                    <div>
                        <p className="font-semibold mb-2">Select Size:</p>
                        <div className="flex gap-3 flex-wrap">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 rounded-full border transition-colors duration-200 ${
                                        selectedSize === size
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-gray-300 hover:bg-gray-100'
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
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full 
                    hover:bg-blue-700 transition-transform duration-200 hover:scale-105 shadow-md"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default Productdisplay;
