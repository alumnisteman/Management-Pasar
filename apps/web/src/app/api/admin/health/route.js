import net from "net";

const SERVICES = [
  {
    id: "mysql",
    name: "MySQL Database",
    description: "Primary relational transaction storage",
    host: "mysql",
    port: 3306,
    tag: "mysql:3306",
  },
  {
    id: "redis",
    name: "Redis Key Cache",
    description: "In-memory cache store and event queuing",
    host: "redis",
    port: 6379,
    tag: "redis:6379",
  },
  {
    id: "laravel",
    name: "Laravel API Core",
    description: "Core application API and router endpoints",
    host: "localhost",
    port: 8000,
    tag: "app:8000",
  },
  {
    id: "reverb",
    name: "Reverb WebSocket Server",
    description: "Real-time web socket broadcast event controller",
    host: "localhost",
    port: 8081,
    tag: "app:8081",
  },
  {
    id: "nginx",
    name: "Nginx Reverse Proxy",
    description: "Gateway server managing routes forwarding",
    host: "localhost",
    port: 80,
    tag: "port:80",
  },
  {
    id: "svms",
    name: "SVMS App Server",
    description: "React Router 7 + Vite application server",
    host: "localhost",
    port: 5000,
    tag: "app:5000",
  },
];

function checkPort(host, port, timeout = 3000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let done = false;

    const finish = (status) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({ status, latency: status === "up" ? Date.now() - start : null });
    };

    socket.setTimeout(timeout);
    socket.connect(port, host, () => finish("up"));
    socket.on("error", () => finish("down"));
    socket.on("timeout", () => finish("down"));
  });
}

export async function GET() {
  try {
    const results = await Promise.all(
      SERVICES.map(async (svc) => {
        const { status, latency } = await checkPort(svc.host, svc.port);
        return { ...svc, status, latency, checkedAt: new Date().toISOString() };
      }),
    );

    const upCount = results.filter((r) => r.status === "up").length;
    const total = results.length;
    const overallHealth =
      upCount === total ? "healthy" : upCount === 0 ? "critical" : "degraded";

    return Response.json({ services: results, upCount, total, overallHealth });
  } catch (error) {
    console.error("[GET /api/admin/health]", error);
    return Response.json({ error: "Health check failed" }, { status: 500 });
  }
}
