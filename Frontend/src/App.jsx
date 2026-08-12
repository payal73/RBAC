import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./Layout/Body";
import Home from "./pages/Home";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/users/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/profile",
              element: <Profile />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
