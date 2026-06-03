import os, re
files = [f for f in os.listdir('programs') if f.endswith('.html')]
for f in files:
    path = os.path.join('programs', f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Add missing </div> between video-container and overview-image
    pattern = re.compile(r'(</iframe>\s*</div>\s*)(<div class="overview-image)', re.DOTALL)
    new_content, count = pattern.subn(r'\1        </div>\n        \2', content)
    
    if count > 0:
        with open(path, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print('Fixed ' + f)
