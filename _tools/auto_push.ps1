# Auto Push Script for Windows
$repoDir = "d:\MP"
cd $repoDir

# Check for changes
$status = git status --porcelain
if ($status) {
    echo "Changes detected. Pushing..."
    git add .
    git commit -m "Auto-sync from local $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push origin master
} else {
    echo "No changes to push."
}
