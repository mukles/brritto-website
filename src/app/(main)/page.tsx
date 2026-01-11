import ContactSection from "./_components/ContactSection";
import CourseExplorerSection from "./_components/CourseExplorerSection";
import FeaturesSection from "./_components/FeaturesSection";
import HeroSection from "./_components/HeroSection";
import { features } from "@/content/features";
import { homeContent } from "@/content/home";
import { homeMetadata } from "@/content/metadata";
import { Metadata } from "next";

export const metadata: Metadata = homeMetadata;
export const revalidate = 36000;

export default function HomePage() {
  const { hero, features: featuresContent } = homeContent;

  return (
    <>
      <HeroSection
        badge={hero.badge}
        title={
          <>
            {hero.title}{" "}
            <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              {hero.brandName}
            </span>
          </>
        }
        subtitle={hero.subtitle}
        primaryCTA={hero.primaryCTA}
        secondaryCTA={hero.secondaryCTA}
        stats={hero.stats}
      />

      {/* Course Explorer Section (Server Component) */}
      <CourseExplorerSection />

      <FeaturesSection
        badge={featuresContent.badge}
        title={
          <>
            {featuresContent.title}{" "}
            <span className="text-purple-600">
              {featuresContent.titleAccent}
            </span>
          </>
        }
        subtitle={featuresContent.subtitle}
        features={features}
      />

      <ContactSection />
    </>
  );
}
