import HeroSection from "@/components/LandingPage/HeroSection"
import WhyChooseUs from "@/components/LandingPage/Features"
import { FeaturedPacksSection } from "@/components/LandingPage/FeaturedToursSection"
import PromoBanner from "@/components/LandingPage/PromoBanner"
import FeaturedGuides from "@/components/LandingPage/FeaturedGuides"
import CustomerReviewsSection from "@/components/LandingPage/CustomerReviewsSection"
import PopularDestinations from "@/components/LandingPage/PopularDestinations"
import HowItWorks from "@/components/LandingPage/HowItWorks"
import NewsletterSection from "@/components/LandingPage/NewsletterSection"
import TravelStatsSection from "@/components/LandingPage/TravelStatsSection"
import FadeInSection from "@/components/FadeInSection"

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <FadeInSection>
        <HeroSection />
      </FadeInSection>

      {/* Stats Section - NEW with real data */}
      {/* <FadeInSection delay={0.1}>
        <StatsSection />
      </FadeInSection> */}

      {/* Why Choose Us */}
      <FadeInSection delay={0.2}>
        <WhyChooseUs />
      </FadeInSection>

      {/* Popular Destinations - NEW with real data */}
      <FadeInSection delay={0.2}>
        <PopularDestinations />
      </FadeInSection>

      {/* Featured Packs Section */}
      <FadeInSection delay={0.2}>
        <FeaturedPacksSection />
      </FadeInSection>

      {/* How It Works - NEW */}
      <FadeInSection delay={0.2}>
        <HowItWorks />
      </FadeInSection>

      {/* Travel Stats Section - NEW with real data */}
      <FadeInSection delay={0.2}>
        <TravelStatsSection />
      </FadeInSection>


      {/* Promo Banner */}
      <FadeInSection delay={0.4}>
        <PromoBanner/>
      </FadeInSection>

      {/* Featured Guides */}
      <FadeInSection delay={0.4}>
        <FeaturedGuides />
      </FadeInSection>

      {/* Customer Reviews */}
      {/* <FadeInSection delay={0.4}>
        <CustomerReviewsSection />
      </FadeInSection> */}

      {/* Newsletter Section - NEW */}
      <FadeInSection delay={0.3}>
        <NewsletterSection />
      </FadeInSection>
    </>
  )
}

export default Home
