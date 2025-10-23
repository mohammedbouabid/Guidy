// src/pages/Home.jsx
import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/Features";
import { FeaturedPacksSection } from "@/components/FeaturedToursSection";
import PromoBanner from "@/components/PromoBanner";
import FeaturedGuides from "@/components/FeaturedGuides";
import CustomerReviewsSection from "@/components/CustomerReviewsSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <FeaturedPacksSection />
      <PromoBanner />
      <FeaturedGuides />
      <CustomerReviewsSection />
    </>
  );
};

export default Home;
