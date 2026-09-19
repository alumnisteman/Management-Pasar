import urllib.request
import json
import ssl

endpoints = [
    '/api/system/health',
    '/api/command-center',
    '/api/gis',
    '/api/gis/digital-twin',
    '/api/gis/stall/A-023',
    '/api/grid-slots',
    '/api/traders',
    '/api/stalls',
    '/api/markets',
    '/api/blocks',
    '/api/collection/aging',
    '/api/inspections',
    '/api/complaints',
    '/api/incidents',
    '/api/announcements',
    '/api/finance/dashboard',
    '/api/approvals',
    '/api/metrics',
    '/api/search?q=test',
    '/admin'
]

base_url = "http://192.168.1.18:8000"
results = {}

for ep in endpoints:
    url = base_url + ep
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            results[ep] = {
                'status': resp.getcode(),
                'content_type': resp.headers.get('Content-Type'),
                'ok': resp.getcode() == 200
            }
    except Exception as e:
        results[ep] = {
            'status': getattr(e, 'code', 500),
            'error': str(e),
            'ok': False
        }

print(json.dumps(results, indent=2))
