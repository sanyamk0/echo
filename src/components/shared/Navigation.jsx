import { IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutAsync,
  selectIsAuth,
  selectUser,
} from "../../app/auth/authSlice";

const Navigation = () => {
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const logoutUser = async () => {
    dispatch(logoutAsync());
  };

  return (
    <div>
      <nav className="py-5 px-0 flex items-center justify-between w-[1200px] max-w-[90%] my-0 mx-auto">
        <span className="text-white no-underline font-bold text-2xl flex items-center">
          Echo
        </span>
        {isAuth && (
          <div className="flex items-center">
            <h3>{user?.name}</h3>
            <img
              className="rounded-full object-cover border-2 border-solid border-[#0077ff] my-0 mx-5 mr-2 w-10 h-10"
              src={user.avatar ? user.avatar : "/images/monkey.png"}
              alt="avatar"
            />
            <button
              className="bg-none cursor-pointer"
              onClick={logoutUser}
              title="Logout"
            >
              <IoMdLogOut className="w-10 h-10" />
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navigation;
