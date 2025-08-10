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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart:</h1>

            {all_product.map((item) => {

                if (carditem[item.id] > 0) {
                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border rounded-lg p-4 mb-4 shadow-sm bg-white"
                        >
                            {/* Product Image */}
                            <div onClick={() => {
                                navigate(`/product/${item.id}`)
                            }} className="w-24 h-24 flex-shrink-0 mr-4">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="text-sm text-green-600">New Price: ₹{item.new_price}</p>
                                <p className="text-sm text-gray-500 line-through">Old Price: ₹{item.old_price}</p>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => removefromcart(item.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Remove
                                </button>
                                <span className="text-md font-medium">Qty: {carditem[item.id]}</span>
                                <button
                                    onClick={() => addtocart(item.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
                    );
                }
                return null;
            })}
            <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
                <p className="text-xl font-semibold mb-4 text-gray-800">Cart Summary</p>

                <div className="space-y-2 text-gray-700 font-medium mb-4">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{findtotal(all_product, carditem)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping Fee:</span>
                        <span className="text-green-600">₹0</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold text-blue-700">
                        <span>Total:</span>
                        <span>₹{findtotal(all_product, carditem)}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/paymentgateway', {
                        state: { amount: findtotal(all_product, carditem) },
                    })}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition mb-4"
                >
                    Proceed to Checkout
                </button>


                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Promo code..."
                        className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                        Submit
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Cartitem;
