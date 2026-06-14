import os
import re

files_to_process = []
for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d != ".git" and not d.startswith(".")]
    for fname in files:
        if fname.endswith((".html", ".css", ".js")):
            files_to_process.append(os.path.join(root, fname))

replacements = [
    (r"Yogartha,\s*Dehradun", "Yogartha"),
    (r"Yogartha\s*Dehradun", "Yogartha"),
    (r"in the heart of Dehradun", "in the heart of the city"),
    (r"in the Dehradun foothills", "in the foothills"),
    (r"in Dehradun", ""),
    (r",\s*Dehradun", ""),
    (r"Dehradun", "")
]

changed_files = []
for fpath in files_to_process:
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        
        original = content
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
            
        # Clean up any leftover awkward spaces or punctuation
        content = re.sub(r'\s+-\s+', ' - ', content)
        content = re.sub(r' \.', '.', content)
        content = re.sub(r' ,', ',', content)
        content = re.sub(r' +', ' ', content) # fix double spaces
        
        if content != original:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(content)
            changed_files.append(fpath)
            print(f"Updated: {fpath}")
    except Exception as e:
        print(f"Error on {fpath}: {e}")

print(f"\nTotal files changed: {len(changed_files)}")
