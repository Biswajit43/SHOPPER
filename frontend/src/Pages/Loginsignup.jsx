import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shopcontext } from '../Context/Shopcontext';// Make sure this path is correct

const Loginsignup = () => {
    const navigate = useNavigate();
    const { handleLoginSuccess } = useContext(Shopcontext);

    const [details, setdetails] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: "",
    });

    const [login, setlogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setdetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const userregister = async () => {
        setIsLoading(true);
        setLoadingMessage("Creating your account...");

        try {
            const response = await fetch(`https://shopper-backend-uolh.onrender.com/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details)
            });

            const data = await response.json();

            if (data.success) {
                setLoadingMessage("Registration successful! Please log in.");
                setTimeout(() => {
                    setlogin(true);
                    setLoadingMessage("");
                }, 1500);
            } else {
                alert("Registration failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            alert("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const userlogin = async () => {
        setIsLoading(true);
        setLoadingMessage("Signing you in...");
        const messageTimer = setTimeout(() => {
            setLoadingMessage("Server is waking up, please wait...");
        }, 5000);

        try {
            const response = await fetch(`https://shopper-backend-uolh.onrender.com/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginDetails)
            });

            clearTimeout(messageTimer);
            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                handleLoginSuccess(); // This updates the global state
                navigate("/");
            } else {
                alert("Login failed! Please check your credentials.");
            }
        } catch (error) {
            clearTimeout(messageTimer);
            alert("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">{loadingMessage}</span>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 px-4">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
                {login ? (
                    <div className="flex flex-col gap-5">
                        <h2 className="text-3xl font-extrabold text-center text-blue-700">Login</h2>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={loginDetails.email}
                                onChange={handleLoginChange}
                                placeholder="Enter your email"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={loginDetails.password}
                                onChange={handleLoginChange}
                                placeholder="Enter your password"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            onClick={userlogin}
                            disabled={isLoading}
                            className={`${isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-semibold py-3 rounded-lg transition flex items-center justify-center min-h-[44px]`}
                        >
                            {isLoading ? <LoadingSpinner /> : 'Login'}
                        </button>

                        <p className="text-sm text-center">
                            Don't have an account?{" "}
                            <button
                                className={`${isLoading
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:underline'
                                    } font-semibold`}
                                onClick={() => !isLoading && setlogin(false)}
                                disabled={isLoading}
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        <h2 className="text-3xl font-extrabold text-center text-blue-700">Register</h2>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={details.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={details.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={details.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            onClick={userregister}
                            disabled={isLoading}
                            className={`${isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-semibold py-3 rounded-lg transition flex items-center justify-center min-h-[44px]`}
                        >
                            {isLoading ? <LoadingSpinner /> : 'Register'}
                        </button>

                        <p className="text-sm text-center">
                            Already have an account?{" "}
                            <button
                                className={`${isLoading
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:underline'
                                    } font-semibold`}
                                onClick={() => !isLoading && setlogin(true)}
                                disabled={isLoading}
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                )}

                {isLoading && loadingMessage.includes('waking up') && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <p className="text-sm text-blue-600">
                            Free hosting servers sleep when inactive. This may take a moment...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Loginsignup;
