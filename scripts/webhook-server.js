const http = require('http');
const crypto = require('crypto');
const { execFile } = require('child_process');
const path = require('path');

const PORT = 9001;
const SECRET = process.env.WEBHOOK_SECRET || '';
const DEPLOY_SCRIPT = path.join(__dirname, 'deploy.sh');

let deploying = false;

function verifyGithubSignature(body, signature) {
  if (!SECRET || !signature) return !SECRET;
  const expected = 'sha256=' + crypto.createHmac('sha256', SECRET).update(body).digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); } catch { return false; }
}

function verifyGitlabToken(token) {
  if (!SECRET) return true;
  try { return crypto.timingSafeEqual(Buffer.from(SECRET), Buffer.from(token || '')); } catch { return false; }
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404);
    return res.end('Not found');
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const githubSig = req.headers['x-hub-signature-256'];
    const gitlabToken = req.headers['x-gitlab-token'];
    const githubEvent = req.headers['x-github-event'];
    const gitlabEvent = req.headers['x-gitlab-event'];

    const isGithub = !!githubEvent;
    const isGitlab = !!gitlabEvent;

    if (isGithub && !verifyGithubSignature(body, githubSig)) {
      console.log('[webhook] GitHub signature mismatch');
      res.writeHead(401);
      return res.end('Unauthorized');
    }
    if (isGitlab && !verifyGitlabToken(gitlabToken)) {
      console.log('[webhook] GitLab token mismatch');
      res.writeHead(401);
      return res.end('Unauthorized');
    }

    let payload;
    try { payload = JSON.parse(body); } catch { payload = {}; }

    const ref = payload.ref || '';
    const branch = ref.replace('refs/heads/', '');
    const source = isGithub ? 'GitHub' : isGitlab ? 'GitLab' : 'unknown';

    if (ref && branch !== 'master' && branch !== 'main') {
      console.log(`[webhook] ${source} push to ${branch} — skipping (not master/main)`);
      res.writeHead(200);
      return res.end('Skipped: not master/main');
    }

    if (deploying) {
      console.log(`[webhook] ${source} push received — deploy already in progress, queued`);
      res.writeHead(202);
      return res.end('Deploy already in progress');
    }

    console.log(`[webhook] ${source} push to ${branch || 'unknown'} — starting deploy`);
    res.writeHead(202);
    res.end('Deploy started');

    deploying = true;
    execFile('/bin/bash', [DEPLOY_SCRIPT], { timeout: 180000 }, (err, stdout, stderr) => {
      deploying = false;
      if (err) {
        console.error('[deploy] FAILED:', err.message);
        console.error('[deploy] stderr:', stderr.slice(-1000));
      } else {
        console.log('[deploy] SUCCESS');
        console.log('[deploy] output:', stdout.slice(-1000));
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[webhook] Server listening on 127.0.0.1:${PORT}`);
});
