import HeroSection from "@/components/HeroSection"
import WhyChooseUs from "@/components/Features"
import { FeaturedPacksSection } from "@/components/FeaturedToursSection"
import PromoBanner from "@/components/PromoBanner"
import FeaturedGuides from "@/components/FeaturedGuides"
import CustomerReviewsSection from "@/components/CustomerReviewsSection"
import LogosCarousel from "@/components/LogosCarousel"
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
