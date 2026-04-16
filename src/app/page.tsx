import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Process from "@/components/Process";
import Curriculum from "@/components/Curriculum";
import GallerySection from "@/components/GallerySection";
import Differentiation from "@/components/Differentiation";
import Pricing from "@/components/Pricing";
import AdminPackage from "@/components/AdminPackage";
import Instructor from "@/components/Instructor";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <Process />
      <Curriculum />
      <GallerySection />
      <Differentiation />
      <Pricing />
      <AdminPackage />
      <Instructor />
      <Reviews />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
