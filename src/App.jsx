import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Activate from "./pages/Activate";
import { useSelector } from "react-redux";
import Authenticate from "./pages/Authenticate";
import Home from "./pages/Home";
import Room from "./pages/Room.jsx";
import Rooms from "./pages/Rooms.jsx";
import AppLayout from "./app/layout/AppLayout.jsx";

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
    element: <AppLayout />,
    children: [
      {
        index: true,
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
      {
        path: "/rooms",
        element: (
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        ),
      },
      {
        path: "/room/:id",
        element: (
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
