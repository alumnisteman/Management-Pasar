import paramiko
import io
import time
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

# 1. Create the API proxy route directory and file
api_route_code = """import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  try {
    const res = await fetch(`http://127.0.0.1:8085/api/news?page=${page}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Backend status: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch news from backend', details: error.message }, { status: 500 });
  }
}
"""

sftp = ssh.open_sftp()
try:
    sftp.mkdir('/root/news-hybrid/frontend/src/app/api')
except IOError:
    pass # already exists

try:
    sftp.mkdir('/root/news-hybrid/frontend/src/app/api/news')
except IOError:
    pass # already exists

sftp.putfo(io.BytesIO(api_route_code.encode('utf-8')), '/root/news-hybrid/frontend/src/app/api/news/route.ts')
print("Created Next.js API route proxy.")

# 2. Update page.tsx to fetch from the local proxy endpoint '/api/news' instead of the absolute IP:8085
page_tsx_code = """'use client'
import { useEffect, useState, useRef, useCallback } from 'react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  source: string;
  category: string;
  link: string;
  published_at: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?page=${p}`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setNews(prev => p === 1 ? data.data : [...prev, ...data.data]);
        setHasMore(data.current_page < data.last_page);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error('Failed to fetch news', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(page); }, [page]);

  const loadMore = () => { if (!loading && hasMore) setPage(p => p + 1); };

  const categoryColor: Record<string, string> = {
    Politik: 'bg-red-500/20 text-red-300',
    Teknologi: 'bg-blue-500/20 text-blue-300',
    Ekonomi: 'bg-yellow-500/20 text-yellow-300',
    Bola: 'bg-green-500/20 text-green-300',
    Viral: 'bg-pink-500/20 text-pink-300',
    Uncategorized: 'bg-gray-500/20 text-gray-300',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0d1117] via-[#0a0a1a] to-[#060612] py-16 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-4 tracking-widest uppercase">Live News</span>
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
            NewsHybrid
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Agregator berita Indonesia real-time dengan AI summarization & RSS hybrid scraping.</p>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {news.length === 0 && !loading && (
          <div className="text-center py-32">
            <div className="text-5xl mb-4">📡</div>
            <p className="text-gray-400 text-xl">Sedang memuat berita dari server...</p>
            <p className="text-gray-600 text-sm mt-2">RSS Fetching berjalan. Refresh dalam beberapa detik.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden h-48 bg-gray-800">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/400/200`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                    <span className="text-5xl">📰</span>
                  </div>
                )}
                {/* Category badge */}
                <span className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-md ${categoryColor[item.category] || categoryColor['Uncategorized']}`}>
                  {item.category || 'Berita'}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-2">
                <span className="text-xs text-blue-400 font-medium tracking-wide uppercase">{item.source}</span>
                <h2 className="text-base font-bold leading-snug text-white group-hover:text-blue-200 transition-colors line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                  {item.excerpt || item.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'}) : ''}
                  </span>
                  <span className="text-xs text-blue-400 group-hover:text-blue-300 font-medium">Baca selengkapnya &rarr;</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Memuat...
                </span>
              ) : 'Muat Lebih Banyak'}
            </button>
          </div>
        )}

        {loading && news.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 animate-pulse">
                <div className="h-48 bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center text-gray-600 text-sm py-8">
        NewsHybrid &copy; 2026 &mdash; Powered by Laravel + Playwright + AI
      </footer>
    </div>
  );
}
"""

sftp.putfo(io.BytesIO(page_tsx_code.encode('utf-8')), '/root/news-hybrid/frontend/src/app/page.tsx')
sftp.close()
print("Updated page.tsx to fetch from the relative API proxy.")

# 3. Force kill and start Next.js dev server on port 8001
print("Restarting Next.js on port 8001...")
ssh.exec_command('fuser -k 8001/tcp 2>/dev/null || true')
ssh.exec_command('pkill -9 -f next-server || true')
ssh.exec_command('pkill -9 -f next || true')
ssh.exec_command('pkill -9 -f node || true')
time.sleep(3)

ssh.exec_command('cd /root/news-hybrid/frontend && nohup npx next dev -p 8001 > /root/news-hybrid/frontend/next.log 2>&1 &')
print("Waiting 20 seconds for compilation...")
time.sleep(20)

# Check curl proxy endpoint
print("Checking proxy endpoint response...")
stdin, stdout, stderr = ssh.exec_command('curl -i http://localhost:8001/api/news?page=1')
print(stdout.read().decode('utf-8', errors='replace')[:500])

ssh.close()
print("Finished!")
