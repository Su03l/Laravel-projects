import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiveChat Pro",
  description: "Connect Instantly. Securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '24px',
              padding: '12px 24px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
