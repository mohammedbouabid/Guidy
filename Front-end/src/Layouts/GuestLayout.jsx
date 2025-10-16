import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Outlet } from "react-router-dom";
import WhyChooseUs from "@/components/Features";

const GuestLayout = () => {
  // const { user, token } = useSelector((state) => state.auth);

//   if (token && user) return <Navigate to="/" />;

  return (
    <div className="h-screen">
      <div  className="bg-white">
            <Navbar/>
            <HeroSection/>
            <WhyChooseUs/>

<<<<<<< HEAD
=======
navbare Componenet   
>>>>>>> db7d1276e70cf4c7e4285a1aae9ce5b7387867e6
      </div>
<Outlet />
    </div>
  );
};

export default GuestLayout;
