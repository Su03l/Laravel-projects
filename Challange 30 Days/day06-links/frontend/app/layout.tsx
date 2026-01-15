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
  title: "LinkShort - Modern URL Shortener",
  description: "Transform your long URLs into clean, memorable short links. Track clicks and analyze your audience with our powerful URL shortener.",
  keywords: ["url shortener", "link shortener", "short links", "analytics"],
  authors: [{ name: "LinkShort" }],
  openGraph: {
    title: "LinkShort - Modern URL Shortener",
    description: "Transform your long URLs into clean, memorable short links.",
    type: "website",
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
