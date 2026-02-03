import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "مدير المهام التعاوني",
  description: "أدر فريقك ومهامك بكفاءة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-white text-slate-600 antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

