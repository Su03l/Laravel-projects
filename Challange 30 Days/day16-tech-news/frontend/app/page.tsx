import Sidebar from "@/components/Sidebar";
import ArticleCard from "@/components/ArticleCard";

// Helper to fetch data safely (Server Component)
async function getPsuedoData(endpoint: string) {
  try {
    const res = await fetch(`http://localhost:8000/api${endpoint}`, {
      cache: 'no-store',
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return [];
  }
}

export default async function Home() {
  const [categoriesData, articlesData, newsData] = await Promise.all([
    getPsuedoData('/categories'),
    getPsuedoData('/articles'),
    getPsuedoData('/external-news')
  ]);

  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];
  const articles = Array.isArray(articlesData) ? articlesData : articlesData.data || [];
  const news = Array.isArray(newsData) ? newsData : newsData.data || [];

  const categoryItems = categories.map((cat: any) => ({
    id: cat.id,
    label: cat.name,
    href: `/categories/${cat.slug || cat.id}`
  }));

  const newsItems = news.map((item: any, index: number) => ({
    id: item.id || `news-${index}`,
    label: item.title,
    href: item.url,
    meta: item.source?.name || 'External Source'
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <Sidebar
            title="Discover"
            items={categoryItems.length > 0 ? categoryItems : [
              { id: 1, label: 'Technology', href: '#' },
              { id: 2, label: 'Programming', href: '#' },
              { id: 3, label: 'AI & Future', href: '#' },
              { id: 4, label: 'Startups', href: '#' },
            ]}
            type="categories"
          />

          <div className="bg-blue-600 rounded-xl p-6 text-white text-center shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <h3 className="font-bold text-lg mb-2">Subscribe to Newsletter</h3>
            <p className="text-blue-100 text-sm mb-4">Get the latest tech trends directly in your inbox.</p>
            <button className="px-4 py-2 bg-white text-blue-600 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors w-full">
              Join Now
            </button>
          </div>
        </aside>

        <main className="col-span-1 lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Latest Articles</h1>
            <div className="text-sm text-gray-500">
              Showing {articles.length} posts
            </div>
          </div>

          {articles.length > 0 ? (
            articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 h-64 border border-gray-100 animate-pulse flex flex-col justify-between">
                  <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
              <p className="text-center text-gray-500 py-4">No articles found. API might be empty or unreachable.</p>
            </div>
          )}
        </main>

        {/* Right Sidebar - External News (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <Sidebar
            title="Trending News"
            items={newsItems.length > 0 ? newsItems : [
              { id: 1, label: 'Loading external news...', href: '#', meta: 'System' }
            ]}
            type="news"
          />
        </aside>

      </div>
    </div>
  );
}
