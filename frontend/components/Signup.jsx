import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  // Create state variables to manage form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  // Get the navigate function from react-router-dom
  const navigate = useNavigate();

  // Function to handle the sign-up process
  const handleSignUp = async () => {
    try {
      // Trim spaces from the name input
      const trimmedName = name.trim();

      // Send a POST request to the backend server with user data
      const response = await axios.post("http://localhost:3000/signup", {
        name: trimmedName,
        email,
        mobile,
        password,
      });

      // If sign-up is successful, log a message and redirect to the sign-in page
      console.log("User signed up successfully!", response.data);
      toast.success("Sign up successful! Please sign in.");
      return navigate("/signin");
    } catch (error) {
      // If an error occurs during sign-up, log the error
      console.error("Error signing up:", error);
    }
  };

  // Render the sign-up form
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white shadow-md p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          User Sign Up
        </h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg px-4 py-2 border mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full rounded-lg px-4 py-2 border mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
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
          onClick={handleSignUp}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Sign Up
        </button>
        <Link
          to="/signin" // Use "to" prop instead of "href" for React Router's Link component
          className="block text-right text-blue-500 hover:underline hover:underline-offset-4"
        >
          Visit Sign in page
        </Link>
      </div>
    </div>
  );
};

export default Signup;
