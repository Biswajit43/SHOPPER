import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe("pk_test_51Rt4GxF6TLEwFse8MFwiPxZZTyMccH0XlEkUzZd9a1uw0Y8ouUiHsRGnCNQQ697qhpnQCvUjq4L2Y23yuPLehgG800TpvLu9WV");

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const pay = location?.state?.amount;

    // Check authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to proceed with payment');
            navigate('/login');
        }
    }, [navigate]);

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

    // Stripe checkout handler with authentication
    const handlePayment = async () => {
        const token = localStorage.getItem('token');
        
        // Double check authentication
        if (!token) {
            alert('Please log in to proceed with payment');
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch("https://shopper-backend-uolh.onrender.com/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": token  // ADD THIS LINE - Required by your backend
                },
                body: JSON.stringify({ amount: pay }),
            });

            // Check if request was successful
            if (!res.ok) {
                if (res.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    alert('Session expired. Please log in again.');
                    navigate('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            
            if (!data.id) {
                console.error("Stripe session ID not received:", data);
                setError("Failed to create payment session");
                return;
            }

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            const result = await stripe.redirectToCheckout({
                sessionId: data.id,
            });

            if (result.error) {
                setError(result.error.message);
            }

        } catch (error) {
            console.error("Payment error:", error);
            setError("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 text-center w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Gateway</h1>
                
                <p className="text-lg text-gray-700 mb-6">
                    Your total amount is: <span className="font-semibold">₹{pay}</span>
                </p>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg transition ${
                        loading 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="block mt-4 text-gray-600 hover:text-gray-800 transition"
                >
                    ← Go Back
                </button>

                {/* Security Notice */}
                <p className="text-xs text-gray-500 mt-4">
                    🔒 Your payment information is secure and encrypted
                </p>
            </div>
        </div>
    );
};

export default Payment;
