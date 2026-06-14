import io, re

with io.open(r'C:\Users\jayan\.gemini\antigravity\brain\cb847544-3539-4e41-b58e-82dfd426ca3f\.system_generated\steps\3689\content.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all static.sadhguru.org or cdn URLs
pattern = r'https://[^\s<>"\']+?(?:jpg|jpeg|png|webp|svg)(?:[^\s<>"\']*)?'
imgs = re.findall(pattern, content, re.IGNORECASE)
for img in sorted(set(imgs)):
    print(img)
