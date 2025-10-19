import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Outlet } from "react-router-dom";
import WhyChooseUs from "@/components/Features";
import { FeaturedPacksSection } from "@/components/FeaturedToursSection";
import FeaturedGuides from "@/components/FeaturedGuides";

const GuestLayout = () => {
  // const { user, token } = useSelector((state) => state.auth);

//   if (token && user) return <Navigate to="/" />;

  return (
    <div className="h-screen">
      <div  className="bg-white">
            <Navbar/>
            <HeroSection/>
            <WhyChooseUs/>
            <FeaturedPacksSection/>
            <FeaturedGuides/>

navbare Componenet   
      </div>
<Outlet />
    </div>
  );
};

export default GuestLayout;
