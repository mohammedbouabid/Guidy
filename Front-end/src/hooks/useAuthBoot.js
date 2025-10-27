import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hydrateUserFromCookie } from "@/store/slices/AuthSlice";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export function useAuthBoot() {
  const dispatch = useDispatch();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const user = getUserFromCookie();
    dispatch(hydrateUserFromCookie(user || null)); // ✅ always dispatch
    setBooted(true); // ✅ mark boot complete
  }, []);

  return booted;
}
