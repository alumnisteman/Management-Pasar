#!/usr/bin/env python3
"""
SVMS Auto Sync - Push perubahan ke GitLab dan GitHub
Token dibaca dari .sync_env (tidak pernah di-commit)
"""
import subprocess
import os
from datetime import datetime

REPO_DIR = "/var/www/svms"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GITLAB_TOKEN = os.environ.get("GITLAB_TOKEN", "")
GITHUB_URL = f"https://alumnisteman:{GITHUB_TOKEN}@github.com/alumnisteman/Management-Pasar.git"
GITLAB_URL = f"https://oauth2:{GITLAB_TOKEN}@gitlab.com/alumnisteman/Management-Pasar.git"
GITHUB_DISPLAY = "https://alumnisteman:[TOKEN]@github.com/alumnisteman/Management-Pasar.git"
GITLAB_DISPLAY = "https://oauth2:[TOKEN]@gitlab.com/alumnisteman/Management-Pasar.git"

def run(display_cmd, actual_cmd=None, cwd=REPO_DIR):
    cmd = actual_cmd if actual_cmd else display_cmd
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    print(f"$ {display_cmd}")
    if result.stdout.strip():
        print(result.stdout.strip())
    if result.stderr.strip():
        # Sembunyikan token dari output
        err = result.stderr.strip()
        for tok in [GITHUB_TOKEN, GITLAB_TOKEN]:
            if tok:
                err = err.replace(tok, "[TOKEN]")
        print(err)
    return result

def get_clean_parent():
    """Ambil commit terakhir yang sudah ada di GitHub (b3eedb2 atau yang terbaru)"""
    r = subprocess.run(['git', 'log', '--oneline', '-50'], cwd=REPO_DIR, capture_output=True, text=True)
    lines = r.stdout.strip().split('\n')
    # Cari commit yang tidak berawalan "Auto-sync" dan bukan hasil squash kita
    for line in lines:
        if not line.strip():
            continue
        commit_hash = line.split()[0]
        msg = ' '.join(line.split()[1:])
        if 'Auto-sync' not in msg and 'chore: update scripts' not in msg and 'Sync:' not in msg:
            return commit_hash
    return lines[-1].split()[0] if lines else None

def sync():
    print(f"\n{'='*50}")
    print(f"SVMS Auto Sync - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*50}\n")

    if not GITHUB_TOKEN or not GITLAB_TOKEN:
        print("ERROR: GITHUB_TOKEN atau GITLAB_TOKEN tidak tersedia!")
        print("Pastikan file .sync_env ada dan berisi token yang valid.")
        return

    run('git config user.email "deploy@svms.id"')
    run('git config user.name "SVMS Auto Sync"')

    run(f'git remote set-url origin "{GITLAB_DISPLAY}"',
        f'git remote set-url origin "{GITLAB_URL}" 2>/dev/null || git remote add origin "{GITLAB_URL}"')
    run(f'git remote remove github; git remote add github "{GITHUB_DISPLAY}"',
        f'git remote remove github 2>/dev/null; git remote add github "{GITHUB_URL}"')

    # Stage semua perubahan
    run("git add -A")
    status = run("git status --porcelain")

    if status.stdout.strip():
        # Ada perubahan — buat commit baru
        ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        run(f'git commit -m "Auto-sync {ts} dari server"')

        # Squash semua commit sejak parent bersih menjadi satu
        parent = get_clean_parent()
        if parent:
            r_tree = subprocess.run(['git', 'write-tree'], cwd=REPO_DIR, capture_output=True, text=True)
            tree_hash = r_tree.stdout.strip()
            env = {**os.environ,
                   'GIT_AUTHOR_NAME': 'SVMS Auto Sync',
                   'GIT_AUTHOR_EMAIL': 'deploy@svms.id',
                   'GIT_COMMITTER_NAME': 'SVMS Auto Sync',
                   'GIT_COMMITTER_EMAIL': 'deploy@svms.id'}
            ts_safe = datetime.now().strftime('%Y-%m-%d %H:%M')
            r_ct = subprocess.run(
                ['git', 'commit-tree', tree_hash, '-p', parent, '-m', f'Sync: update otomatis {ts_safe}'],
                cwd=REPO_DIR, capture_output=True, text=True, env=env
            )
            new_commit = r_ct.stdout.strip()
            if new_commit:
                subprocess.run(['git', 'update-ref', 'HEAD', new_commit], cwd=REPO_DIR, capture_output=True)
                subprocess.run(['git', 'reflog', 'expire', '--expire=now', '--all'], cwd=REPO_DIR, capture_output=True)
                subprocess.run(['git', 'gc', '--prune=now', '--quiet'], cwd=REPO_DIR, capture_output=True)
                print(f"[squash] → {new_commit[:8]} (parent: {parent})")
    else:
        print("Tidak ada perubahan baru untuk di-commit.")

    # Push ke GitLab
    r1 = run("git push --force origin master",
             "git push --force origin master 2>&1")
    print("GitLab:", "✓ OK" if r1.returncode == 0 else "✗ FAILED")

    # Push ke GitHub
    r2 = run("git push --force github master",
             "git push --force github master 2>&1")
    print("GitHub:", "✓ OK" if r2.returncode == 0 else "✗ FAILED")

    print(f"\nSync selesai: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    sync()
