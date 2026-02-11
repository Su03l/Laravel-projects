import { Link } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-black p-1.5 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-[#00D1FF]" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Edu<span className="text-[#00D1FF]">Core</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/browse" className="text-sm font-medium hover:text-[#00D1FF] transition-colors">Browse Courses</Link>
                        <Link href="/login" className="text-sm font-medium hover:text-[#00D1FF] transition-colors">Log in</Link>
                        <Link
                            href="/register"
                            className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-[0_0_15px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF]"
                        >
                            Join for Free
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
