import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../images/10.jpg";

function Login() {
  let navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    if (!json.success) {
      alert("Invalid credentials");
    } else {
      localStorage.setItem("authToken", json.authToken);
      navigate("/chat");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignUpClick = () => {
    navigate("/signup"); // Navigate to the signup page
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-[#141F0E] bg-opacity-20 w-full h-full flex items-center justify-center">
        <div className="max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-[#176446]">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={onChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#176446] text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-gray-700 mt-4 text-center">
            New User?{" "}
            <button
              onClick={handleSignUpClick}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Sign Up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
