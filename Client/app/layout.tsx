import type { Metadata } from "next";

import { Footer } from "@/src/components/footer";
import { Header } from "@/src/components/header";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dazzling Diva",
  description: "Luxury fashion storefront for sarees, lehengas, and festive womenswear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
