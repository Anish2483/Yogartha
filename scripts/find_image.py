import urllib.request
import re

url = "https://isha.sadhguru.org/yoga/yoga-articles-hatha-yoga-asanas/asanas-guide/"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
req = urllib.request.Request(url, headers=headers)
html = urllib.request.urlopen(req).read().decode("utf-8")

lines = html.splitlines()
found = False
for i, line in enumerate(lines):
    if "Fine-tuning your Asanas" in line:
        found = True
    if found and "<img" in line:
        print("Image line:", line)
        m = re.search(r'src="([^"]+)"', line)
        if m:
            print("Found image:", m.group(1))
        break
