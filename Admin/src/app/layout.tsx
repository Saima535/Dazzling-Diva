import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dazzling Diva Admin",
  description: "Protected admin and backend for Dazzling Diva commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
