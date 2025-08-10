// Success.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const clearCart = async () => {
            try {
                const token = localStorage.getItem("token"); // Get user token
                const response = await fetch("https://shopper-backend-uolh.onrender.com/empty", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: token,
                    },
                });

                if (response.ok) {
                    console.log("Cart emptied successfully");
                } else {
                    console.error("Failed to clear cart");
                }
            } catch (err) {
                console.error("Error clearing cart:", err);
            }
        };

        clearCart();
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
            <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Payment Successful!</h1>
            <p className="text-lg text-gray-600">Your cart has been cleared. Thank you for shopping!</p>
            <button
                onClick={() => navigate("/")}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
                Continue Shopping
            </button>
        </div>
    );
};

export default Success;
