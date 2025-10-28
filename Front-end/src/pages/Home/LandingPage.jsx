import HeroSection from "@/components/LandingPage/HeroSection"
import WhyChooseUs from "@/components/LandingPage/Features"
import { FeaturedPacksSection } from "@/components/LandingPage/FeaturedToursSection"
import PromoBanner from "@/components/LandingPage/PromoBanner"
import FeaturedGuides from "@/components/LandingPage/FeaturedGuides"
import CustomerReviewsSection from "@/components/LandingPage/CustomerReviewsSection"
import LogosCarousel from "@/components/LandingPage/LogosCarousel"
import FadeInSection from "@/components/FadeInSection"

const Home = () => {
  return (
    <>
      <FadeInSection>
        <HeroSection />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <WhyChooseUs />
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <FeaturedPacksSection />
      </FadeInSection>

      <FadeInSection delay={0.3}>
        <LogosCarousel />
      </FadeInSection>

      <FadeInSection delay={0.3}>
        <PromoBanner/>
      </FadeInSection>

      <FadeInSection delay={0.5}>
        <FeaturedGuides />
      </FadeInSection>

      <FadeInSection delay={0.6}>
        <CustomerReviewsSection />
      </FadeInSection>
    </>
  )
}

export default Home
