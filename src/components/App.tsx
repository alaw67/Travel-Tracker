import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import MapChart from "./MapChart";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MapChart />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
