import os
for path in ['css/style.css', 'css/program-page.css']:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_reveal = 'transition: all 1s ease-out;'
    new_reveal = 'transition: opacity 1s ease-out, transform 1s ease-out;'
    
    if old_reveal in content:
        content = content.replace(old_reveal, new_reveal)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Optimized CSS in ' + path)
