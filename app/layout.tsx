import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pobitra-Zakat.ly – Real-time Zakat Calculator (Gold & Silver) | Islamic Finance",
  description: "Calculate your Zakat precisely with live gold & silver rates. Includes cash, gold, silver, debts, Nisab eligibility, and downloadable PDF summary.",
  keywords: [
    "Zakat Calculator",
    "Islamic Finance",
    "Gold Rates Bangladesh",
    "Silver Rates Bangladesh",
    "Nisab Calculator",
    "Pobitra-Zakat.ly",
    "Zakat PDF Summary",
    "Muslim Finance Tools",
  ],
  authors: [{ name: "Rakib Islam Rifat", url: "https://www.linkedin.com/in/rakib-islam-rifat/" }],
  themeColor: "#059669", 
  viewport: "width=device-width, initial-scale=1.0",
  
  openGraph: {
    title: "Pobitra-Zakat.ly – Real-time Zakat Calculator",
    description: "Calculate your Zakat precisely with live gold & silver rates. Download a PDF summary for your records.",
    url: "https://yourdomain.com",
    siteName: "Pobitra-Zakat.ly",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Pobitra-Zakat.ly Calculator Screenshot",
      },
    ],
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Pobitra-Zakat.ly – Real-time Zakat Calculator",
    description: "Calculate your Zakat precisely with live gold & silver rates. Download a PDF summary for your records.",
    images: ["/og-image.png"],
    creator: "@YourTwitterHandle", 
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
