import re

files_to_fix = ['js/main.js', 'js/program-page.js']

for filepath in files_to_fix:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_scroll = '''window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});'''
    
    new_scroll = '''let lastScrollState = false;
window.addEventListener('scroll', () => {
  const isScrolled = window.scrollY > 50;
  if (isScrolled !== lastScrollState) {
    if (isScrolled) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollState = isScrolled;
  }
}, { passive: true });'''
    
    if old_scroll in content:
        content = content.replace(old_scroll, new_scroll)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Optimized ' + filepath)

