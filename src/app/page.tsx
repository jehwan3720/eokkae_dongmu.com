import { Suspense } from "react";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import CurriculumMapping from "@/components/CurriculumMapping";
import Curriculum from "@/components/Curriculum";
import TeacherSupport from "@/components/TeacherSupport";
import ProductTech from "@/components/ProductTech";
import GallerySection from "@/components/GallerySection";
import Differentiation from "@/components/Differentiation";
import Pricing from "@/components/Pricing";
import AdminPackage from "@/components/AdminPackage";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <CurriculumMapping />
      <Curriculum />
      <TeacherSupport />
      <ProductTech />
      <Suspense fallback={null}>
        <GallerySection />
      </Suspense>
      <Differentiation />
      <Pricing />
      <AdminPackage />
      <Reviews />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
