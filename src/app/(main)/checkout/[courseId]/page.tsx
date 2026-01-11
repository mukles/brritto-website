import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseDetails } from "@/lib/server/course-service";
import CheckoutPageClient from "./CheckoutPageClient";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const response = await getCourseDetails(courseId);

  if (!response.success || !response.data) {
    return { title: "Checkout - Course Not Found" };
  }

  return {
    title: `Checkout - ${response.data.courseName}`,
    description: `Complete your enrollment for ${response.data.courseName}`,
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { courseId } = await params;

  const response = await getCourseDetails(courseId);

  if (!response.success || !response.data) {
    notFound();
  }

  return <CheckoutPageClient course={response.data} />;
}
