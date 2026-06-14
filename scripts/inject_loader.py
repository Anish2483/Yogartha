import os, re

def inject_loader(filepath, is_program):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if loader already exists
    if '<div id="loader">' in content:
        return
        
    img_prefix = '../' if is_program else ''
    loader_html = f'''
  <div id="loader">
    <img src="{img_prefix}images/yogartha_logo.png" alt="Yogartha" class="loader-logo-img" />
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
  </div>'''
    
    # Find <body> tag and inject loader right after it
    # Account for body tag variations like <body class="...">
    new_content = re.sub(r'(<body[^>]*>)', r'\1' + loader_html, content, count=1, flags=re.IGNORECASE)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'Injected loader in {filepath}')

# Root index.html
if os.path.exists('index.html'):
    inject_loader('index.html', False)

# Programs
if os.path.isdir('programs'):
    for fname in os.listdir('programs'):
        if fname.endswith('.html'):
            inject_loader(os.path.join('programs', fname), True)
            
print('Done!')
