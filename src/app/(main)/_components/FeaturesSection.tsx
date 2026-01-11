import React from "react";
import Card from "@/components/ui/Card";

export interface Feature {
  icon: React.ReactNode;
  iconBgColor: string;
  borderColor: string;
  title: string;
  description: string;
}

export interface FeaturesSectionProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  features: Feature[];
}

export default function FeaturesSection({
  badge = "Platform Features",
  title,
  subtitle = "Comprehensive learning tools designed for students who want to master their subjects",
  features,
}: FeaturesSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-600 text-white text-sm font-semibold mb-4">
            {badge}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              icon={feature.icon}
              iconBgColor={feature.iconBgColor}
              borderColor={feature.borderColor}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
