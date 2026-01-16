import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "دليل الهاتف الذكي | إدارة جهات الاتصال",
  description: "تطبيق دليل هاتف عصري وأنيق لإدارة جميع جهات الاتصال بكفاءة",
  keywords: ["دليل الهاتف", "جهات الاتصال", "أرقام الهاتف", "phonebook"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
