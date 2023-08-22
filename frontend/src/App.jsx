import React from "react";
import ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate, // Import the useNavigate hook
} from "react-router-dom";
import Signup from "../components/Signup";
import Signin from "../components/Signin";
import Dashboard from "../components/Dashboard";
import AppLayout from "./AppLayout";
import { ToastProvider, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const isAuthenticated = () => {
  const authToken = Cookies.get("authToken");
  return !!authToken; // Convert authToken to a boolean value
};

const SignInRoute = ({ element }) => {
  const navigate = useNavigate(); // Use the useNavigate hook

  if (isAuthenticated()) {
    navigate("/dashboard"); // Redirect to the dashboard if the user is already authenticated
    return null;
  } else {
    return element;
  }
};

const DashboardRoute = ({ element }) => {
  const navigate = useNavigate(); // Use the useNavigate hook

  if (!isAuthenticated()) {
    navigate("/signin"); // Redirect to the sign-in page if the user is not authenticated
    return null;
  } else {
    return element;
  }
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/", // Sign-up page
        element: <SignInRoute element={<Signup />} />,
      },
      {
        path: "/signin",
        element: <SignInRoute element={<Signin />} />,
      },
      {
        path: "/dashboard",
        element: <DashboardRoute element={<Dashboard />} />,
      },
    ],
  },
  // Add the route for the sign-up page
  {
    path: "/signup",
    element: <Signup />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <RouterProvider router={appRouter}>
    <Toaster />
  </RouterProvider>
);
