import React, { useContext, useEffect, useState } from 'react'
import { Shopcontext } from '../../Context/Shopcontext'
import { useParams } from 'react-router-dom'

const Productdisplay = (props) => {
    const { addtocart } = useContext(Shopcontext)
    const { productid } = useParams()
    const { product } = props

    const [selectedSize, setSelectedSize] = useState('M')
    if (!product) {
        return <p className="text-red-500 text-center p-4">Product not found</p>
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top smoothly
    }, [productid]);
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <div className="flex flex-col items-center">
                {/* Thumbnail Gallery */}
                <div className="flex gap-2 mb-4">
                    {[product.image, product.image, product.image].map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`preview-${idx}`}
                            className={`w-16 h-16 object-cover rounded-md border cursor-pointer hover:scale-105 transition  'border-blue-600'
                                }`}
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

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <span key={item} className="text-yellow-400 text-lg">★</span>
                    ))}
                    <span className="text-gray-600 text-sm">(132 ratings)</span>
                </div>
                {/* Price */}
                <div className="flex items-center gap-4">
                    <span className="text-green-600 text-xl font-semibold">₹{product.new_price}</span>
                    <span className="text-gray-400 line-through text-lg">₹{product.old_price}</span>
                </div>

                {/* Size Options */}
                <div>
                    <p className="font-semibold mb-2">Select Size:</p>
                    <div className="flex gap-3">
                        {['M', 'L', 'XL', 'XXL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 rounded-full border ${selectedSize === size
                                    ? 'bg-black text-white'
                                    : 'bg-white text-black border-gray-400'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Add to Cart */}
                <button
                    onClick={() => addtocart(product.id)}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
export default Productdisplay
