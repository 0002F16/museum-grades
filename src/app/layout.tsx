import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Museum Grades — Luxury Handbag Catalogue",
  description:
    "Discover the world's finest pre-owned luxury handbags. Authentic Chanel, Louis Vuitton, Hermès, Gucci and more — curated and catalogued by Museum Grades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
