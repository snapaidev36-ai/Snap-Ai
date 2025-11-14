import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Hero from "@/components/landing/Hero";
import LandingPageSteps from "@/components/landing/LandingPageSteps";
import LandingPageTools from "@/components/landing/LandingPageTools";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <LandingPageSteps />
      <LandingPageTools />
      <Footer />
    </main>
  );
}
