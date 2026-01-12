import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-16">
                <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Day 02 Challenge
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    مرحباً بك في <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">المدونة</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    نظام إدارة محتوى بسيط وأنيق. أضف تصنيفات ومقالات بسهولة.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        to="/categories"
                        className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                    >
                        إدارة التصنيفات
                    </Link>
                    <Link
                        to="/posts"
                        className="px-6 py-3 bg-white text-gray-900 rounded-xl font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        إدارة المقالات
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">التصنيفات</h3>
                    <p className="text-gray-600 text-sm">أنشئ وأدر التصنيفات لتنظيم مقالاتك بشكل أفضل.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">المقالات</h3>
                    <p className="text-gray-600 text-sm">اكتب ونشر مقالاتك بسهولة مع ربطها بالتصنيفات.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">أداء سريع</h3>
                    <p className="text-gray-600 text-sm">واجهة سريعة وسلسة مبنية بـ React و Laravel.</p>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">التقنيات المستخدمة</h2>
                <div className="flex items-center justify-center gap-8 flex-wrap">
                    {['React', 'Tailwind CSS', 'Laravel', 'Axios', 'Vite'].map((tech) => (
                        <div key={tech} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium text-sm">
                            {tech}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
