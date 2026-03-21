import HeroSection from "@/components/landing/HeroSection";
import ValueStrip from "@/components/landing/ValueStrip";
import EqualityFlow from "@/components/landing/EqualityFlow";
import SystemSurfaces from "@/components/landing/SystemSurfaces";
import CivicValue from "@/components/landing/CivicValue";
import BottomCTA from "@/components/landing/BottomCTA";
import Footer from "@/components/landing/Footer";

export default function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <HeroSection />
      <ValueStrip />
      <EqualityFlow />
      <SystemSurfaces />
      <CivicValue />
      <BottomCTA />
      <Footer />
    </div>
  );
}
