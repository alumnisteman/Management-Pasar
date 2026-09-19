import re

def check_dupes():
    with open('dashboard_v55.html', 'r', encoding='utf-8') as f:
        content = f.read()
    ids = re.findall(r'id=["\'](.*?)["\']', content)
    seen = {}
    for i in ids:
        seen[i] = seen.get(i, 0) + 1
    
    dupes = {k: v for k, v in seen.items() if v > 1}
    print("Duplicate IDs:", dupes)

if __name__ == "__main__":
    check_dupes()
