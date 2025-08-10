import React, { useEffect, useState } from 'react';

const Allproduct = () => {
  const [product, setproduct] = useState([]);

  const allitem = async () => {
    await fetch(`https://shopper-backend-uolh.onrender.com/allproduct`)
      .then((res) => res.json())
      .then((data) => setproduct(data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const removeitem = async (id) => {
    await fetch(`https://shopper-backend-uolh.onrender.com/remove_product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    }).then(() => alert("Item removed!"))
      .catch((err) => console.error("Error removing item:", err));

    await allitem();
  };

  useEffect(() => {
    allitem();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        All Available Products
      </h1>

      {/* Show message if no products */}
      {product.length === 0 ? (
        <h1 className="text-center text-xl text-gray-600">No Item Is Available Right Now</h1>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {product.map((item) => (
            <div
              key={item._id || item.name}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 ease-in-out"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="hover:scale-105 transition-transform duration-300 h-60 w-full object-cover rounded-t-2xl"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {item.name}
                </h2>

                <div className="flex items-center gap-3">
                  <span className="text-green-600 font-bold text-base">
                    ₹{item.new_price}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ₹{item.old_price}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeitem(item._id)}
                className="w-full bg-red-500 text-white font-semibold py-2 rounded-b-lg hover:bg-red-600 transition duration-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allproduct;
