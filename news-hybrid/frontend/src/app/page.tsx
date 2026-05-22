import { useEffect, useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  source: string;
  content: string;
  image: string;
  link: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://103.175.219.57:8005/api/news?page=${page}`);
      const data = await res.json();
      // Assuming the API returns an array under data.data or data
      const items = data.data ? data.data : data;
      setNews((prev) => [...prev, ...items]);
    } catch (e) {
      console.error('Failed to fetch news', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page]);

  return (
    <main className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">NewsHybrid – Indonesia Real‑time</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n) => (
            <article key={n.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
              <img src={n.image || '/fallback.jpg'} alt={n.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs text-blue-400 mb-2">{n.source}</span>
                <h2 className="text-lg font-semibold line-clamp-2 mb-2">{n.title}</h2>
                <p className="text-sm text-gray-300 line-clamp-3 mb-4 flex-grow">{n.content}</p>
                <a href={n.link} target="_blank" rel="noopener noreferrer" className="mt-auto text-blue-500 hover:underline text-sm">
                  Read full article
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      </div>
    </main>
  );
}
