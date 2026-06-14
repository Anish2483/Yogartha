import io
from bs4 import BeautifulSoup
import json

with io.open(r'C:\Users\jayan\.gemini\antigravity\brain\cb847544-3539-4e41-b58e-82dfd426ca3f\.system_generated\steps\3421\content.md', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# Check NEXT_DATA script first
script = soup.find('script', id='__NEXT_DATA__')
if script and script.string:
    try:
        data = json.loads(script.string)
        # We know it's a Next.js app, we can extract pageProps recursively
        def find_text(d):
            if isinstance(d, dict):
                for k, v in d.items():
                    if k in ['html', 'text', 'content', 'description'] and isinstance(v, str):
                        print(f"[{k}]", BeautifulSoup(v, 'html.parser').get_text(separator=' ', strip=True)[:200])
                    find_text(v)
            elif isinstance(d, list):
                for i in d:
                    find_text(i)
        find_text(data)
    except:
        pass

print("\n--- HTML TEXT ---")
for p in soup.find_all(['p', 'h1', 'h2', 'h3']):
    text = p.get_text(separator=' ', strip=True)
    if text and len(text) > 30:
        print(f"[{p.name}] {text}")
