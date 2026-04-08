import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import FAQ from "@/components/pricing/FAQ";
import Hero from "@/components/pricing/Hero";
import Packages from "@/components/pricing/PricingPackages";

export default function Pricing() {
  return (
    <main>
      <Header />
      <Hero />
      <Packages />
      <FAQ />
      <Footer />
    </main>
  );
}
