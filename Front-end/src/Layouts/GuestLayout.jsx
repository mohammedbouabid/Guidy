import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Outlet } from "react-router-dom";
import WhyChooseUs from "@/components/Features";
import { FeaturedPacksSection } from "@/components/FeaturedToursSection";
import FeaturedGuides from "@/components/FeaturedGuides";
import CustomerReviewsSection from "@/components/CustomerReviewsSection";
import PromoBanner from "@/components/promoBanner";


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
