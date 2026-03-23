import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import FooterSection from "@/components/sections/footer-section";
// __PAGE_IMPORTS__

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      {/* __PAGE_SECTIONS__ */}
      <FooterSection />
    </main>
  );
}
