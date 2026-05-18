import os from 'node:os';
import net from 'node:net';
import { execSync } from 'node:child_process';

const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8002";

function checkPort(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 1500;
    
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      socket.end();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

function getDiskSpace() {
  try {
    const out = execSync('df -h /').toString();
    const lines = out.trim().split('\n');
    if (lines.length > 1) {
      const parts = lines[1].replace(/\s+/g, ' ').split(' ');
      return {
        size: parts[1],
        used: parts[2],
        available: parts[3],
        percent: parts[4]
      };
    }
  } catch (err) {
    console.error('Failed to get disk space:', err.message);
  }
  return { size: 'N/A', used: 'N/A', available: 'N/A', percent: '0%' };
}

export async function GET(request) {
  try {
    // 1. Get frontend OS metrics
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPercent = Math.round((usedMem / totalMem) * 100);
    const loadAvg = os.loadavg();
    const cpus = os.cpus();
    
    const frontendMetrics = {
      memory: {
        total: `${Math.round(totalMem / (1024 * 1024 * 1024) * 100) / 100} GB`,
        free: `${Math.round(freeMem / (1024 * 1024 * 1024) * 100) / 100} GB`,
        used: `${Math.round(usedMem / (1024 * 1024 * 1024) * 100) / 100} GB`,
        percent: memPercent
      },
      cpu: {
        load: loadAvg,
        cores: cpus.length,
        model: cpus[0]?.model || 'Intel Core'
      },
      uptime: `${Math.round(os.uptime() / 3600 * 10) / 10} hours`,
      disk: getDiskSpace()
    };

    // 2. Fetch backend metrics
    let backendMetrics = null;
    try {
      const res = await fetch(`${BACKEND}/api/system/guard-probe`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        backendMetrics = await res.json();
      } else {
        backendMetrics = { status: 'DEGRADED', error: `HTTP ${res.status}` };
      }
    } catch (err) {
      backendMetrics = { status: 'DOWN', error: err.message };
    }

    // 3. Check WebSockets (Reverb) Port 8081
    let websocketStatus = 'DOWN';
    try {
      const backendUrl = new URL(BACKEND);
      const backendHost = backendUrl.hostname; // E.g. 'app' inside Docker, or public IP
      const isReverbAlive = await checkPort(8081, backendHost);
      websocketStatus = isReverbAlive ? 'OK' : 'DOWN';
    } catch (err) {
      console.error('Failed checking WebSocket:', err.message);
    }

    // 4. Check Web Server (Nginx Proxy Response time)
    const start = Date.now();
    let nginxStatus = 'OK';
    let latency = '0ms';
    try {
      const res = await fetch(`${BACKEND}/api/ping`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        latency = `${Date.now() - start}ms`;
      } else {
        nginxStatus = 'DEGRADED';
      }
    } catch (err) {
      nginxStatus = 'DOWN';
    }

    // Determine overall guard status
    let guardStatus = 'OPERATIONAL';
    if (backendMetrics?.status === 'DOWN' || nginxStatus === 'DOWN') {
      guardStatus = 'CRITICAL';
    } else if (backendMetrics?.status === 'DEGRADED' || websocketStatus === 'DOWN' || memPercent > 90) {
      guardStatus = 'DEGRADED';
    }

    return Response.json({
      status: guardStatus,
      timestamp: new Date().toISOString(),
      frontend: frontendMetrics,
      backend: backendMetrics,
      websocket: websocketStatus,
      nginx: {
        status: nginxStatus,
        latency
      }
    });

  } catch (error) {
    console.error('[GET /api/admin/system-guard] error:', error);
    return Response.json({ error: "Failed to load System Guard status" }, { status: 500 });
  }
}
