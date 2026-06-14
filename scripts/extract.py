import io
import re
import json

with io.open(r'C:\Users\jayan\.gemini\antigravity\brain\cb847544-3539-4e41-b58e-82dfd426ca3f\.system_generated\steps\3421\content.md', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    print('Found NEXT DATA')
    print(json.dumps(data)[:2000])
else:
    print('No NEXT DATA found')
    
    # Try finding any text containing "Pilgrimage"
    paragraphs = re.findall(r'>([^<]+)<', html)
    print("Found text blocks:")
    for p in paragraphs:
        if len(p.strip()) > 50:
            print(p.strip())
