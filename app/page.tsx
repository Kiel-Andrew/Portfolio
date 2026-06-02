import HeroSection from "@/components/minimal/HeroSection";
import TechStackCarousel from "@/components/minimal/TechStackCarousel";
import CertificatesExperienceSection from "@/components/minimal/CertificatesExperienceSection";
import ProjectsSection from "@/components/minimal/ProjectsSection";
import FooterSection from "@/components/minimal/FooterSection";

export default function MinimalViewPage() {
  return (
    <main className="bg-white dark:bg-zinc-950 min-h-screen">
      <HeroSection />
      <TechStackCarousel />
      <CertificatesExperienceSection />
      <ProjectsSection />
      <FooterSection />
    </main>
  );
}
