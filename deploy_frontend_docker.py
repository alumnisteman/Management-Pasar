import paramiko
import io
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

sftp = ssh.open_sftp()

def run_cmd(cmd, timeout=120):
    print(f"\n=== {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: print("STDOUT:", out[:3000])
    if err: print("STDERR:", err[:2000])
    return out, err

# ---- Step 1: Create Next.js Dockerfile ----
frontend_dockerfile = """FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
"""

sftp.putfo(io.BytesIO(frontend_dockerfile.encode()), '/root/news-hybrid/frontend/Dockerfile')
print("Created frontend/Dockerfile")

# ---- Step 2: Enable standalone output in next.config ----
next_config = """/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://news-hybrid-app-1:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
"""
sftp.putfo(io.BytesIO(next_config.encode()), '/root/news-hybrid/frontend/next.config.js')
print("Updated next.config.js with standalone output and rewrites")

# ---- Step 3: Update page.tsx - remove local proxy, use /api/news directly ----
page_tsx = """'use client'
import { useEffect, useState, useCallback } from 'react';

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

  useEffect(() => { fetchNews(1); }, []);
  const loadMore = () => { if (!loading && hasMore) { const next = page + 1; setPage(next); fetchNews(next); } };

  const categoryColor: Record<string, string> = {
    Politik: 'bg-red-500/20 text-red-300',
    Teknologi: 'bg-blue-500/20 text-blue-300',
    Ekonomi: 'bg-yellow-500/20 text-yellow-300',
    Olahraga: 'bg-green-500/20 text-green-300',
    Viral: 'bg-pink-500/20 text-pink-300',
    Uncategorized: 'bg-gray-500/20 text-gray-300',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0d1117] via-[#0a0a1a] to-[#060612] py-16 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-4 tracking-widest uppercase">Live News</span>
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">NewsHybrid</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Agregator berita Indonesia real-time dengan AI summarization & RSS hybrid scraping.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {news.length === 0 && !loading && (
          <div className="text-center py-32">
            <div className="text-5xl mb-4">📡</div>
            <p className="text-gray-400 text-xl">Memuat berita...</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {news.map((item) => (
            <a key={item.id} href={item.link} target="_blank" rel="noreferrer"
              className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="relative overflow-hidden h-48 bg-gray-800">
                {item.image ? (
                  <img src={item.image} alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/400/200`; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                    <span className="text-5xl">📰</span>
                  </div>
                )}
                <span className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-md ${categoryColor[item.category] || categoryColor['Uncategorized']}`}>
                  {item.category || 'Berita'}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <span className="text-xs text-blue-400 font-medium tracking-wide uppercase">{item.source}</span>
                <h2 className="text-base font-bold leading-snug text-white group-hover:text-blue-200 transition-colors line-clamp-2">{item.title}</h2>
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{item.excerpt || item.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : ''}</span>
                  <span className="text-xs text-blue-400 group-hover:text-blue-300 font-medium">Baca &rarr;</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 animate-pulse">
                <div className="h-48 bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}
        {hasMore && !loading && (
          <div className="text-center mt-12">
            <button onClick={loadMore}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/20">
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
      <footer className="border-t border-white/10 text-center text-gray-600 text-sm py-8">NewsHybrid &copy; 2026 &mdash; Laravel + Playwright + AI</footer>
    </div>
  );
}
"""
sftp.putfo(io.BytesIO(page_tsx.encode()), '/root/news-hybrid/frontend/src/app/page.tsx')
print("Updated page.tsx")

# ---- Step 4: Update docker-compose.yml to add frontend service on port 8090 ----
docker_compose = """services:
  app:
    build: 
      context: .
      dockerfile: docker/app.Dockerfile
    command: php artisan serve --host=0.0.0.0 --port=8000
    ports:
      - "8085:8000"
    volumes:
      - ./app-backend:/var/www/html
    depends_on:
      - mysql
      - redis
    networks:
      - news_net

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "8090:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - app
    networks:
      - news_net

  mysql:
    image: mysql:8
    ports:
      - "3307:3306"
    environment:
      MYSQL_DATABASE: news_hybrid
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - news_net

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - news_net

  scraper:
    image: mcr.microsoft.com/playwright:v1.52.0
    volumes:
      - ./scraper:/scraper
    working_dir: /scraper
    command: tail -f /dev/null
    networks:
      - news_net

  meilisearch:
    image: getmeili/meilisearch:v1.12
    ports:
      - "7700:7700"
    environment:
      - MEILI_MASTER_KEY=masterKey
    volumes:
      - meili_data:/meili_data
    networks:
      - news_net

networks:
  news_net:
    driver: bridge

volumes:
  mysql_data:
  redis_data:
  meili_data:
"""
sftp.putfo(io.BytesIO(docker_compose.encode()), '/root/news-hybrid/docker-compose.yml')
print("Updated docker-compose.yml with frontend service on 8090")

# ---- Step 5: Update Next.js API route to use container hostname ----
api_route = """import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://news-hybrid-app-1:8000';
    const res = await fetch(`${backendUrl}/api/news?page=${page}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Backend status: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch news', details: error.message }, { status: 500 });
  }
}
"""
sftp.putfo(io.BytesIO(api_route.encode()), '/root/news-hybrid/frontend/src/app/api/news/route.ts')
print("Updated API proxy route to use container hostname")

sftp.close()

# ---- Step 6: Build and start Docker containers ----
print("\nBuilding and starting Docker containers (this may take 2-3 minutes)...")
stdin, stdout, stderr = ssh.exec_command(
    "cd /root/news-hybrid && docker compose build frontend 2>&1 | tail -30",
    timeout=300
)
out = stdout.read().decode('utf-8', errors='replace')
err = stderr.read().decode('utf-8', errors='replace')
print("BUILD OUTPUT:", out[-3000:])
if err: print("BUILD ERR:", err[-1000:])

print("\nStarting all containers...")
stdin, stdout, stderr = ssh.exec_command(
    "cd /root/news-hybrid && docker compose up -d 2>&1",
    timeout=120
)
print(stdout.read().decode('utf-8', errors='replace'))
print(stderr.read().decode('utf-8', errors='replace'))

print("\nWaiting 15 seconds...")
time.sleep(15)

print("\nChecking container status...")
run_cmd("docker ps | grep news-hybrid")

print("\nTesting port 8090...")
run_cmd("curl -si http://localhost:8090/ | head -10")

ssh.close()
print("\nDone!")
