import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CMS — Reza & Lela Wedding",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
