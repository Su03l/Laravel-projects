import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mini Store - متجر إلكتروني مصغر",
  description: "نظام إدارة منتجات متعدد التصنيفات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b-2 border-black bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-black hover:text-gray-600 transition-colors">
                Mini Store
              </Link>
              <nav className="flex gap-6">
                <Link
                  href="/"
                  className="text-black hover:text-gray-600 font-medium transition-colors"
                >
                  المنتجات
                </Link>
                <Link
                  href="/products/create"
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  + إضافة
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-black mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-600">
              تحدي 30 يوم - 30 مشروع | اليوم الثالث
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
