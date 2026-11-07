import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "AYURGRAPH-X | BioCultural Intelligence & Discovery Platform",
  description: "Connecting Traditional Knowledge with Molecular Science for Explainable Preclinical Ethnopharmacology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-botanical-parchment text-botanical-charcoal">
        <Navigation>{children}</Navigation>
      </body>
    </html>
  );
}
