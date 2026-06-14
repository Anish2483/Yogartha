import os

programs_dir = 'programs'
gallery_html = """
    <!-- ===== GALLERY ===== -->
    <section id="gallery" class="gallery-section section-pad" style="display:none;">
      <div class="container">
        <div class="section-header reveal">
          <p class="section-eyebrow">Our Studio</p>
          <h2 class="section-title">Life at Yogartha</h2>
          <p class="section-sub">Moments from our classes, retreats, and community</p>
        </div>
        <div class="gallery-masonry reveal" id="gallery-masonry">
          <!-- Photos loaded dynamically from admin panel -->
        </div>
      </div>
    </section>
"""

for file in os.listdir(programs_dir):
    if not file.endswith('.html'):
        continue
    filepath = os.path.join(programs_dir, file)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    
    # 1. Add data-page-id to body
    page_id = file.replace('.html', '')
    if '<body' in content and 'data-page-id=' not in content:
        content = content.replace('<body', f'<body data-page-id="{page_id}"', 1)
        changed = True
        
    # 2. Add gallery HTML before footer
    if '<footer' in content and 'id="gallery"' not in content:
        content = content.replace('<footer', gallery_html + '\n    <footer', 1)
        changed = True
        
    # 3. Add site-loader.js
    if 'site-loader.js' not in content:
        if '</body>' in content:
            content = content.replace('</body>', '  <script src="../js/site-loader.js"></script>\n</body>', 1)
            changed = True
            
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')
