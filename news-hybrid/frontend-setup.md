# Frontend setup (Next.js + Tailwind)

1. Create a Next.js app: `npx create-next-app@latest frontend`
2. Answer the prompts (use TypeScript, Tailwind, App Router).
3. Inside `app/page.tsx`, you can use the following structure:

```tsx
'use client'

import { useEffect, useState } from 'react';

export default function Home() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);

  const fetchNews = async () => {
    const res = await fetch(`http://localhost:8000/api/news?page=${page}`);
    const data = await res.json();
    setNews(prev => [...prev, ...data.data]);
  };

  useEffect(() => {
    fetchNews();
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">News Aggregator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((n: any) => (
          <div key={n.id} className="rounded-xl overflow-hidden shadow-lg bg-gray-800 text-white flex flex-col">
             <img src={n.image || '/fallback.jpg'} alt={n.title} className="w-full h-48 object-cover" />
             <div className="p-4 flex flex-col flex-grow">
               <span className="text-xs text-blue-400 mb-2">{n.source}</span>
               <h2 className="text-lg font-bold mb-2 line-clamp-2">{n.title}</h2>
               <p className="text-sm text-gray-300 line-clamp-3 mb-4">{n.content}</p>
               <a href={n.link} target="_blank" className="mt-auto text-blue-500 text-sm hover:underline">Read Full Article</a>
             </div>
          </div>
        ))}
      </div>
      <button 
        onClick={() => setPage(p => p + 1)} 
        className="mt-8 w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold"
      >
        Load More
      </button>
    </div>
  );
}
```
