import net from "net";
import { execSync } from "child_process";

function checkProcess(processName) {
  try {
    const out = execSync(`pgrep -f "${processName}" 2>/dev/null || true`).toString().trim();
    return out.length > 0 ? "up" : "down";
  } catch {
    return "down";
  }
}

const SERVICES = [
  {
    id: "mysql",
    name: "MySQL Database",
    description: "Primary relational transaction storage",
    host: "127.0.0.1",
    port: 3306,
    tag: "mysql:3306",
  },
  {
    id: "redis",
    name: "Redis Key Cache",
    description: "In-memory cache store and event queuing",
    host: "127.0.0.1",
    port: 6379,
    tag: "redis:6379",
  },
  {
    id: "laravel",
    name: "Laravel API Core",
    description: "Core application API and router endpoints",
    host: "127.0.0.1",
    port: 8000,
    tag: "app:8000",
  },
  {
    id: "reverb",
    name: "Reverb WebSocket Server",
    description: "Real-time web socket broadcast event controller",
    host: "127.0.0.1",
    port: 8080,
    tag: "app:8080",
  },
  {
    id: "nginx",
    name: "Nginx Reverse Proxy",
    description: "Gateway server managing routes forwarding",
    host: "127.0.0.1",
    port: 80,
    tag: "port:80",
  },
  {
    id: "worker",
    name: "Queue Event Worker",
    description: "Background job processor (svms-worker-1)",
    host: "127.0.0.1",
    port: 8000,
    tag: "svms-worker-1",
    checkType: "process",
    processName: "queue:work",
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
        let status, latency;
        if (svc.checkType === "process") {
          status = checkProcess(svc.processName);
          latency = null;
        } else {
          ({ status, latency } = await checkPort(svc.host, svc.port));
        }
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
