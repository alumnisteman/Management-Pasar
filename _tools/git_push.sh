#!/bin/bash
# Push perubahan file ke GitHub via API menggunakan GITHUB_TOKEN
# Penggunaan: bash _tools/git_push.sh "pesan commit" file1 file2 ...
# Contoh:     bash _tools/git_push.sh "update halaman login" apps/web/src/app/login/page.jsx

set -e

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN tidak ditemukan."
  exit 1
fi

REPO="alumnisteman/Management-Pasar"
BRANCH="master"
COMMIT_MSG="${1:-Auto-sync dari Replit $(date '+%Y-%m-%d %H:%M:%S')}"

shift
FILES=("$@")

if [ ${#FILES[@]} -eq 0 ]; then
  echo "Tidak ada file yang ditentukan."
  echo "Penggunaan: bash _tools/git_push.sh \"pesan commit\" file1 file2 ..."
  exit 0
fi

PUSHED=0
FAILED=0

for FILE in "${FILES[@]}"; do
  if [ ! -f "$FILE" ]; then
    echo "SKIP: $FILE (tidak ditemukan)"
    continue
  fi

  CONTENT=$(base64 -w 0 "$FILE")
  CURRENT_SHA=$(curl -s \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$REPO/contents/$FILE?ref=$BRANCH" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('sha',''))" 2>/dev/null)

  if [ -z "$CURRENT_SHA" ]; then
    # File baru (belum ada di GitHub)
    PAYLOAD=$(python3 -c "
import json, sys
print(json.dumps({
  'message': sys.argv[1],
  'content': sys.argv[2],
  'branch': sys.argv[3]
}))" "$COMMIT_MSG" "$CONTENT" "$BRANCH")
  else
    PAYLOAD=$(python3 -c "
import json, sys
print(json.dumps({
  'message': sys.argv[1],
  'content': sys.argv[2],
  'sha': sys.argv[3],
  'branch': sys.argv[4]
}))" "$COMMIT_MSG" "$CONTENT" "$CURRENT_SHA" "$BRANCH")
  fi

  RESULT=$(curl -s -X PUT \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "https://api.github.com/repos/$REPO/contents/$FILE")

  STATUS=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print('ok' if 'content' in d else d.get('message','error'))" 2>/dev/null)

  if [ "$STATUS" = "ok" ]; then
    echo "✓ $FILE"
    PUSHED=$((PUSHED+1))
  else
    echo "✗ $FILE — $STATUS"
    FAILED=$((FAILED+1))
  fi
done

echo ""
echo "Selesai: $PUSHED berhasil, $FAILED gagal"
echo "Commit: \"$COMMIT_MSG\" → https://github.com/$REPO/commits/$BRANCH"
