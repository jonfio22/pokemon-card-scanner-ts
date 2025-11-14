import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokemon Card Scanner - AI-Powered Card Valuation",
  description: "Scan Pokemon cards and get instant AI-powered market valuations using GPT-4 Vision and TCGPlayer pricing data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
