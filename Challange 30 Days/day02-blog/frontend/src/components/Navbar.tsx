import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const linkClass = (path: string) =>
        `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(path)
            ? 'bg-black text-white shadow-lg'
            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
        }`;

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Blog</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className={linkClass('/')}>
                            الرئيسية
                        </Link>
                        <Link to="/categories" className={linkClass('/categories')}>
                            التصنيفات
                        </Link>
                        <Link to="/posts" className={linkClass('/posts')}>
                            المقالات
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
