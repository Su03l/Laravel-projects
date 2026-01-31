import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "الداشبورد المالي",
  description: "نظام الفواتير والمتابعة المالية (نسخة برو)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} font-sans antialiased bg-gray-50`}
      >
        <AuthProvider>
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontFamily: 'var(--font-cairo)' } }} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
