import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "لايف شات برو LiveChat Pro",
  description: "تواصل بسرعة وأمان. خليك متصل طول الوقت.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid #1e293b',
              borderRadius: '24px',
              padding: '12px 24px',
              fontFamily: 'Cairo, sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}
