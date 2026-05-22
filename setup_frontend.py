import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('103.175.219.57', username='root', password='M4ruw4h3@')

print("Scaffolding Next.js Frontend...")
command = """
cd /root/news-hybrid
if [ ! -d "frontend" ]; then
    npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
fi
cd frontend

cat << 'EOF' > src/app/page.tsx
'use client'
import { useEffect, useState } from 'react';
export default function Home() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const fetchNews = async () => {
    try {
      const res = await fetch(`http://103.175.219.57:8085/api/news?page=${page}`);
      const data = await res.json();
      if(data.data) {
        setNews(prev => [...prev, ...data.data]);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => { fetchNews(); }, [page]);
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-center">Trending News Hybrid</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((n: any) => (
            <div key={n.id} className="rounded-2xl overflow-hidden shadow-2xl bg-gray-800 flex flex-col hover:scale-105 transition-transform duration-300 border border-gray-700">
               <img src={n.image || 'https://via.placeholder.com/400x200?text=No+Image'} alt={n.title} className="w-full h-56 object-cover" />
               <div className="p-6 flex flex-col flex-grow">
                 <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">{n.source}</span>
                 <h2 className="text-xl font-bold mb-3 leading-snug">{n.title}</h2>
                 <p className="text-sm text-gray-400 line-clamp-3 mb-5">{n.content || n.excerpt}</p>
                 <a href={n.link} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center text-blue-400 font-medium hover:text-blue-300">
                   Read Full Article &rarr;
                 </a>
               </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setPage(p => p + 1)} 
          className="mt-12 w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl hover:opacity-90 font-bold text-lg shadow-lg transition-opacity"
        >
          Load More News
        </button>
      </div>
    </div>
  );
}
EOF

# Start Next.js in background using nohup
nohup npm run dev -- -p 3000 > next.log 2>&1 &
"""

stdin, stdout, stderr = ssh.exec_command(command)
for line in iter(stdout.readline, ''): print(line, end='')
err = stderr.read().decode()
if err: print('STDERR:', err)

ssh.close()
