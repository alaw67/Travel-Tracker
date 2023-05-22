import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import MapChart from "./MapChart";
import Signup from "./Signup";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MapChart />,
      // errorElement: <ErrorPage />,
      // loader: rootLoader,
      // children: [
      //   {
      //     path: "contacts/:contactId",
      //     element: <Contact />,
      //   },
      // ],
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

  return <RouterProvider router={router} />;
};

export default App;
