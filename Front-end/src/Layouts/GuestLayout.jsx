import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  // const { user, token } = useSelector((state) => state.auth);

//   if (token && user) return <Navigate to="/" />;

  return (
    <div className="h-screen">
      <div  className="bg-white">
            <Navbar/>
      </div>
<Outlet />
    </div>
  );
};

export default GuestLayout;
