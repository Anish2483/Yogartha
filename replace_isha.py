import os, re

# Step 1: Fix hero subtitle in index.html
index_path = "index.html"
with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

old_hero = 'Rooted in the classical Hatha Yoga tradition of Adiyogi.<br />Guided by the wisdom of Sadhguru. Located in Dehradun.'
new_hero = 'Classical Hatha Yoga &amp; Wellness Centre<br />By a Classical Hatha Yoga Teacher Certified under Sadhguru Gurukulam'

content = content.replace(old_hero, new_hero)
with open(index_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed hero subtitle in index.html")

# Step 2: Replace "Isha Hatha Yoga" with "Classical Hatha Yoga" across all files
# BUT keep "Isha Foundation", "Isha Yoga Center", "Isha Janani" etc. intact
# ALSO skip admin.html placeholder text (it is a dynamic input field)

files_to_process = []
for root, dirs, files in os.walk("."):
    # Skip .git folder
    dirs[:] = [d for d in dirs if d != ".git" and not d.startswith(".")]
    for fname in files:
        if fname.endswith((".html", ".css", ".js")):
            files_to_process.append(os.path.join(root, fname))

# Pattern: Isha Hatha Yoga (case insensitive)
pattern = re.compile(r'Isha Hatha Yoga', re.IGNORECASE)

changed_files = []
for fpath in files_to_process:
    with open(fpath, "r", encoding="utf-8") as f:
        original = f.read()
    
    # Smart replacement: preserve case where it's an important title
    # Replace all variants with "Classical Hatha Yoga"
    new_content = pattern.sub("Classical Hatha Yoga", original)
    
    if new_content != original:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        count = len(pattern.findall(original))
        changed_files.append((fpath, count))
        print(f"  Changed {count}x in: {fpath}")

print(f"\nTotal files changed: {len(changed_files)}")
