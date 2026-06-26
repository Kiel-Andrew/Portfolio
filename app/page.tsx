import HeroSection from "@/components/minimal/HeroSection";
import TechStackCarousel from "@/components/minimal/TechStackCarousel";
import CertificatesExperienceSection from "@/components/minimal/CertificatesExperienceSection";
import ProjectsSection from "@/components/minimal/ProjectsSection";
import FooterSection from "@/components/minimal/FooterSection";

export default function MinimalViewPage() {
  return (
    <main className="bg-white dark:bg-zinc-950 min-h-screen">
      <HeroSection />
      
      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
        <div className="border-t border-zinc-100 dark:border-zinc-900" />
      </div>
      <TechStackCarousel />
      
      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
        <div className="border-t border-zinc-100 dark:border-zinc-900" />
      </div>
      <CertificatesExperienceSection />
      
      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
        <div className="border-t border-zinc-100 dark:border-zinc-900" />
      </div>
      <ProjectsSection />
      
      <div className="mx-auto max-w-6xl px-8 sm:px-16 md:px-24 lg:px-32">
        <div className="border-t border-zinc-100 dark:border-zinc-900" />
      </div>
      <FooterSection />
    </main>
  );
}
