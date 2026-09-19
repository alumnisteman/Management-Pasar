import urllib.request
import json

try:
    url = "http://103.175.219.57:8001/api/permits"
    response = urllib.request.urlopen(url)
    data = json.loads(response.read().decode())
    
    djauhar = [p for p in data if p.get('trader') and p['trader'].get('name') == 'DJAUHAR']
    
    if djauhar:
        print("DJAUHAR found in /api/permits response:")
        print(json.dumps(djauhar[0], indent=2))
    else:
        print("DJAUHAR is NOT in the response. Full data length:", len(data))
        for d in data:
            if d.get('trader'):
                print(" - Found trader:", d['trader'].get('name'))
            else:
                print(" - Permit with NO trader data. ID:", d.get('id'), "Trader ID:", d.get('trader_id'))
except Exception as e:
    print(f"Error: {e}")
