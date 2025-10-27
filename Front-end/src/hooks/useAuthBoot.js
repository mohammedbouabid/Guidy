import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hydrateUserFromCookie } from "@/store/slices/AuthSlice";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export function useAuthBoot() {
  const dispatch = useDispatch();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const user = getUserFromCookie();
    if (user) {
      dispatch(hydrateUserFromCookie(user));
    }

    const timer = setTimeout(() => {
      setBooted(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return booted;
}
