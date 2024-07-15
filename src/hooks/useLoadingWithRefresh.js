import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../app/auth/authSlice";
import api from "../http";

export const useLoadingWithRefresh = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/auth/refresh", {
          withCredentials: true,
        });
        dispatch(setAuth(data));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, [dispatch]);

  return { loading };
};
