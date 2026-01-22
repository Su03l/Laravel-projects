import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModalProvider } from "@/contexts/ModalContext";
import ToastProvider from "@/providers/ToastProvider";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";

export const metadata: Metadata = {
  title: "تغريداتي | شبكة اجتماعية",
  description: "شارك أفكارك مع العالم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        <AuthProvider>
          <ModalProvider>
            <ToastProvider />
            <LoginModal />
            <Navbar />
            <main>{children}</main>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
