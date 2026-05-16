# Auto Sync Script for Windows
$repoDir = "d:\MP"
cd $repoDir

# 1. Pull latest changes from GitHub first
echo "Checking for updates from GitHub..."
git pull origin master

# 2. Check for local changes to push
$status = git status --porcelain
if ($status) {
    echo "Local changes detected. Pushing..."
    git add .
    git commit -m "Auto-sync from local $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push origin master
} else {
    echo "No local changes to push."
}
