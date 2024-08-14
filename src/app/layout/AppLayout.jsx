import Navigation from "../../components/shared/Navigation";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
};

export default AppLayout;
