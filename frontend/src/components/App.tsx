import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Login from "./Login";
import WorldMap from "./WorldMap";
import Signup from "./Signup";
import Header from "./Header";
import { AuthContextProvider } from "../context/AuthContext";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <WorldMap />,
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
        <Header />
        <RouterProvider router={router} />
      </AuthContextProvider>
    </React.StrictMode>
  );
};

export default App;
