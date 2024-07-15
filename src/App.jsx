import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Authenticate from "./pages/Authenticate";
import Activate from "./pages/Activate";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return isAuth ? <Navigate to="/rooms" /> : children;
};

const SemiProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && user && !user.activated ? (
    children
  ) : (
    <Navigate to="/rooms" />
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && user && !user.activated ? (
    <Navigate to="/activate" />
  ) : (
    children
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GuestRoute>
        <Home />
      </GuestRoute>
    ),
  },
  {
    path: "/authenticate",
    element: (
      <GuestRoute>
        <Authenticate />
      </GuestRoute>
    ),
  },
  {
    path: "/activate",
    element: (
      <SemiProtectedRoute>
        <Activate />
      </SemiProtectedRoute>
    ),
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
