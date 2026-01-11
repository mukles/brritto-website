import { ReactNode } from "react";

export const revalidate = 36000;

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
