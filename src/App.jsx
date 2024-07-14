import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Authenticate from "./pages/Authenticate";
import Activate from "./pages/Activate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/authenticate",
    element: <Authenticate />,
  },
  {
    path: "/activate",
    element: <Activate />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
