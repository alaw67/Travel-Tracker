import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Login from "./Login";
import Home from "./Home";
import Signup from "./Signup";
import { AuthContextProvider } from "../context/AuthContext";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return (
    <React.StrictMode>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </React.StrictMode>
  );
};

export default App;
