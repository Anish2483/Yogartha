import os, re

# Step 2: Replace "Isha Hatha Yoga" with "Classical Hatha Yoga" across all files
pattern = re.compile(r'Isha Hatha Yoga', re.IGNORECASE)

files_to_process = []
for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d != ".git" and not d.startswith(".")]
    for fname in files:
        if fname.endswith((".html", ".css", ".js")):
            files_to_process.append(os.path.join(root, fname))

changed_files = []
for fpath in files_to_process:
    try:
        with open(fpath, "r", encoding="utf-8", errors="replace") as f:
            original = f.read()
        
        new_content = pattern.sub("Classical Hatha Yoga", original)
        
        if new_content != original:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(new_content)
            count = len(pattern.findall(original))
            changed_files.append((fpath, count))
            print(f"  Changed {count}x in: {fpath}")
    except Exception as e:
        print(f"  SKIP {fpath}: {e}")

print(f"\nTotal files changed: {len(changed_files)}")
