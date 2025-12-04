// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/UseContext";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/auth/google`;
  };

  const registerUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      const { accessToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      signup(user);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters long");

    setLoading(true);
    registerUser();
  };

  return (
    <div className="min-h-screen bg-[#0F231F] flex justify-center items-center px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl">

        {/* LEFT SIDE HERO */}
        <div className="text-white flex flex-col justify-center p-10 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-[#3DDC97] px-3 py-2 rounded-lg text-black font-bold text-xl">✓</div>
            <h1 className="text-3xl font-bold tracking-wide">TASKS</h1>
          </div>

          <h2 className="text-4xl font-bold leading-tight">
            Systemise Project <br /> Management. <br /> Simplify Success
          </h2>

          <p className="text-gray-300">
            Plan smarter & track faster with an all-in-one tool.  
            Automate routine tasks and let AI handle verification for you.
          </p>
        </div>

        {/* RIGHT SIDE - SIGNUP CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto my-6">
          <h3 className="text-2xl font-semibold text-center">Let’s Get Started!</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            Continue with Email or Google
          </p>

          {/* Google Login */}
          <button
            onClick={handleGoogle}
            className="w-full mt-6 border flex items-center justify-center gap-2 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <img
              src="data:image/jpeg;base64,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"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {error && (
            <p className="bg-red-50 border-l-4 border-red-400 p-3 text-sm text-red-700 mb-3">
              {error}
            </p>
          )}

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-800 transition shadow-md"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Have an account?{" "}
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
