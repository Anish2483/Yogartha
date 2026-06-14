import re
import glob

# Replace src="data:image..." data-fallback="images/..." with src="images/..." data-fallback="images/..."
pattern = r'src="data:image/gif;base64,[^"]*"\s+data-fallback="([^"]+)"'

def repl(match):
    fallback_url = match.group(1)
    return f'src="{fallback_url}" data-fallback="{fallback_url}"'

for filepath in glob.glob('programs/*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if 'data:image/gif;base64' in html:
        new_html = re.sub(pattern, repl, html)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f'Fixed placeholders in {filepath}')
