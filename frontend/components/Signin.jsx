import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:3000/signin", {
        email,
        password,
      });

      console.log("User signed in successfully!", response.data);

      // Set the received token as an HttpOnly cookie
      Cookies.set("authToken", response.data.token, {
        expires: new Date(Date.now() + 3600000), // Token expires in 1 hour (in milliseconds)
        secure: true, // Set 'secure' to true if your frontend is served over HTTPS
        sameSite: "strict", // Adjust 'sameSite' as needed based on your requirements
      });

      // Redirect to the dashboard
      return navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white shadow-md p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          User Sign In
        </h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg px-4 py-2 border mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg px-4 py-2 border mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleSignIn}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Sign In
        </button>
        <Link
          to="/" // Use "to" prop instead of "href" for React Router's Link component
          className="block text-right text-blue-500 hover:underline hover:underline-offset-4"
        >
          Visit Sign up page
        </Link>
      </div>
    </div>
  );
};

export default Signin;
