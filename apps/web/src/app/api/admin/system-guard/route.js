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

    // 2. Mock backend metrics (since we are fully local now)
    const backendMetrics = { 
      status: 'OPERATIONAL', 
      db_connections: 5, 
      redis_memory: '12MB',
      queue_workers: 2 
    };

    // 3. Mock WebSockets (Reverb) Port
    let websocketStatus = 'OK';

    // 4. Mock Web Server (Nginx Proxy Response time)
    const start = Date.now();
    let nginxStatus = 'OK';
    let latency = `${Math.floor(Math.random() * 50) + 10}ms`;

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
