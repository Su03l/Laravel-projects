import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-8">
                {children}
            </main>
            <footer className="border-t border-gray-200 bg-white mt-auto">
                <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
                    &copy; 2026 Blog - Day 02 Challenge
                </div>
            </footer>
        </div>
    );
};

export default Layout;
