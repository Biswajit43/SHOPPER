import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe("pk_test_51Rt4GxF6TLEwFse8MFwiPxZZTyMccH0XlEkUzZd9a1uw0Y8ouUiHsRGnCNQQ697qhpnQCvUjq4L2Y23yuPLehgG800TpvLu9WV");

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const pay = location?.state?.amount;

    // Redirect if no amount passed
    if (pay === undefined) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-semibold text-red-600 mb-4">Invalid Payment Request</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Stripe checkout handler
    const handlePayment = async () => {
        const stripe = await stripePromise;

        const res = await fetch("https://shopper-backend-uolh.onrender.com/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: pay }),
        });

        const data = await res.json();

        if (!data.id) {
            console.error("Stripe session ID not received:", data);
            alert("Failed to create payment session");
            return;
        }
        // Redirect to Stripe Checkout
        
        const result = await stripe.redirectToCheckout({
            sessionId: data.id,
        });

        if (result.error) {
            alert(result.error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 text-center w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Gateway</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Your total amount is: <span className="font-semibold">₹{pay}</span>
                </p>
                <button
                    onClick={handlePayment}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default Payment;
