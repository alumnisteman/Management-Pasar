import urllib.request
import json

try:
    url = "http://103.175.219.57:8001/api/permits"
    response = urllib.request.urlopen(url)
    data = json.loads(response.read().decode())
    
    print(f"Total permits: {len(data)}")
    print("Permit list order:")
    for i, d in enumerate(data):
        name = d.get('trader', {}).get('name', 'N/A') if d.get('trader') else 'N/A'
        print(f" {i+1}. {name}")
        
except Exception as e:
    print(f"Error: {e}")
