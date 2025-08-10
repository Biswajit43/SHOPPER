import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Loginsignup = () => {
  const navigate = useNavigate();
  const [details, setdetails] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

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


  const [login, setlogin] = useState(false);

  const userregister = async () => {
    await fetch(`https://shopper-backend-uolh.onrender.com/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details)
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert("Registration failed: " + (data.error || "Unknown error"));
      }
    })
  }

  const userlogin = async () => {
    await fetch(`https://shopper-backend-uolh.onrender.com/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails)
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/");
      }
      else {
        alert("logged in failed!")
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
        {login ? (
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-extrabold text-center text-blue-700">Login</h2>
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={loginDetails.email}
                onChange={handleLoginChange}
                placeholder="Enter your username"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
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
              />
            </div>

            <button onClick={userlogin} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
              Login
            </button>

            <p className="text-sm text-center">
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:underline font-semibold"
                onClick={() => setlogin(false)}
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
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={details.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
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
              />
            </div>

            <button onClick={userregister} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
              Register
            </button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline font-semibold"
                onClick={() => setlogin(true)}
              >
                Login here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loginsignup;
