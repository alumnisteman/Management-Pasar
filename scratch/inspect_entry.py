import urllib.request

url = "http://103.175.219.57:8001/assets/entry.client-D5kiEPzi.js"
try:
    response = urllib.request.urlopen(url)
    content = response.read().decode('utf-8')
    with open("scratch/inspect_entry.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully wrote entry script to scratch/inspect_entry.txt")
except Exception as e:
    print("Error:", e)
