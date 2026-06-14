import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace src="data:image..." data-fallback="images/..." with src="images/..." data-fallback="images/..."
# We will keep data-fallback just in case, but put the real image path in src so it loads instantly.
pattern = r'src="data:image/gif;base64,[^"]*"\s+data-fallback="([^"]+)"'

def repl(match):
    fallback_url = match.group(1)
    return f'src="{fallback_url}" data-fallback="{fallback_url}"'

new_html = re.sub(pattern, repl, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Replaced placeholders with real image sources in index.html")
