import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
    title: "مصادقة متقدمة", // AuthMaster in Arabic
    description: "نظام مصادقة متقدم",
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
                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}
