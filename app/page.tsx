import MinimalHeader from "@/components/minimal/MinimalHeader";
import HeroSection from "@/components/minimal/HeroSection";
import TechStackCarousel from "@/components/minimal/TechStackCarousel";
import CertificatesExperienceSection from "@/components/minimal/CertificatesExperienceSection";
import ProjectsSection from "@/components/minimal/ProjectsSection";
import FooterSection from "@/components/minimal/FooterSection";

export default function MinimalViewPage() {
  return (
    <>
      <MinimalHeader />
      <main className="bg-white dark:bg-zinc-950">
        <HeroSection />
        <TechStackCarousel />
        <CertificatesExperienceSection />
        <ProjectsSection />
        <FooterSection />
      </main>
    </>
  );
}
