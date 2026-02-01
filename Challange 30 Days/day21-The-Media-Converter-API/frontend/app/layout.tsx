import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { cn } from "@/lib/utils";

// Initialize Cairo font
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أدوات المطورين | Developer Toolbox",
  description: "مجموعة أدوات احترافية للمطورين",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cn(
        "min-h-screen bg-slate-50 font-sans antialiased",
        cairo.variable,
        cairo.className
      )}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'var(--font-cairo)',
            },
            success: {
              style: {
                background: '#F0FDFA', // Tealy background for success
                color: '#0F766E',
                border: '1px solid #CCFBF1',
              }
            },
            error: {
              style: {
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FEE2E2',
              }
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}
